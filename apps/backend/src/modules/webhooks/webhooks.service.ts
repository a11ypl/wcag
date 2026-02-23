import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import oracledb from 'oracledb';
import { OciObjectStorageService } from '../../integrations/oci/object-storage.service';
import { OracleService } from '../../integrations/oracle/oracle.service';
import { AuditService } from '../audit/audit.service';
import { WebhookUploadDto } from './dto/webhook-upload.dto';

interface ExistingEventRow {
  eventId: string;
}

interface ExistingDocumentRow {
  documentId: number;
}

interface MaxVersionRow {
  maxVersionNo: number;
}

@Injectable()
export class WebhooksService {
  constructor(
    private readonly config: ConfigService,
    private readonly oracle: OracleService,
    private readonly oci: OciObjectStorageService,
    private readonly audit: AuditService,
  ) {}

  async isProcessed(eventId: string): Promise<boolean> {
    const rows = await this.oracle.execute<ExistingEventRow>(
      `
      SELECT webhook_event_id AS "eventId"
      FROM webhook_events
      WHERE webhook_event_id = :eventId
      FETCH FIRST 1 ROWS ONLY
      `,
      { eventId },
    );

    return rows.length > 0;
  }

  async processDocumentEvent(input: {
    eventId: string;
    file: Express.Multer.File;
    payload: WebhookUploadDto;
  }): Promise<{ documentId: number; versionId: number }> {
    const systemUserId = Number(this.config.get<string>('SYSTEM_USER_ID') ?? 1);
    const checksum = createHash('sha256').update(input.file.buffer).digest('hex');
    const safeFilename = sanitizeFilename(input.file.originalname || 'document.bin');
    const objectName = `${input.payload.docType}/${Date.now()}-${safeFilename}`;

    await this.oci.uploadObject({
      objectName,
      content: input.file.buffer,
      contentType: input.file.mimetype || 'application/octet-stream',
      checksumSha256: checksum,
    });

    return this.oracle.withTransaction(async (connection) => {
      await this.insertWebhookReceived(connection, input.eventId, input.payload.sourceSystem);

      const documentId = await this.findOrCreateDocument(
        connection,
        input.payload,
        systemUserId,
      );

      const nextVersionNo = await this.getNextVersionNo(connection, documentId);

      await connection.execute(
        `
        UPDATE document_versions
        SET is_current = 0
        WHERE document_id = :documentId
          AND is_current = 1
        `,
        { documentId },
        { autoCommit: false },
      );

      const versionId = await this.insertDocumentVersion(connection, {
        documentId,
        versionNo: nextVersionNo,
        objectName,
        originalFilename: safeFilename,
        contentType: input.file.mimetype || 'application/octet-stream',
        fileSizeBytes: input.file.size,
        checksum,
        uploadedByUserId: systemUserId,
        eventId: input.eventId,
      });

      await connection.execute(
        `
        UPDATE documents
        SET current_version_id = :versionId,
            updated_at = SYSTIMESTAMP
        WHERE document_id = :documentId
        `,
        {
          versionId,
          documentId,
        },
        { autoCommit: false },
      );

      await this.audit.logWithConnection(connection, {
        userId: systemUserId,
        documentId,
        versionId,
        actionType: 'WEBHOOK_UPLOAD',
      });

      await connection.execute(
        `
        UPDATE webhook_events
        SET status = 'PROCESSED',
            processed_at = SYSTIMESTAMP
        WHERE webhook_event_id = :eventId
        `,
        { eventId: input.eventId },
        { autoCommit: false },
      );

      return { documentId, versionId };
    });
  }

  private async insertWebhookReceived(
    connection: oracledb.Connection,
    eventId: string,
    sourceSystem: string,
  ) {
    try {
      await connection.execute(
        `
        INSERT INTO webhook_events (
          webhook_event_id,
          source_system,
          status
        ) VALUES (
          :eventId,
          :sourceSystem,
          'RECEIVED'
        )
        `,
        {
          eventId,
          sourceSystem,
        },
        { autoCommit: false },
      );
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'errorNum' in error &&
        (error as { errorNum?: number }).errorNum === 1
      ) {
        throw new ConflictException('Duplicate event');
      }
      throw new InternalServerErrorException('Cannot register webhook event');
    }
  }

  private async findOrCreateDocument(
    connection: oracledb.Connection,
    payload: WebhookUploadDto,
    systemUserId: number,
  ): Promise<number> {
    const rows = await connection.execute<ExistingDocumentRow>(
      `
      SELECT document_id AS "documentId"
      FROM documents
      WHERE doc_type = :docType
        AND title = :title
      FETCH FIRST 1 ROWS ONLY
      `,
      {
        docType: payload.docType,
        title: payload.title,
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: false },
    );

    if (rows.rows && rows.rows[0]) {
      return Number(rows.rows[0].documentId);
    }

    const insertResult = await connection.execute(
      `
      INSERT INTO documents (
        doc_type,
        title,
        visibility_tier,
        created_by_user_id,
        is_active
      ) VALUES (
        :docType,
        :title,
        :visibilityTier,
        :createdByUserId,
        1
      )
      RETURNING document_id INTO :newDocumentId
      `,
      {
        docType: payload.docType,
        title: payload.title,
        visibilityTier: payload.visibilityTier,
        createdByUserId: systemUserId,
        newDocumentId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: false },
    );

    const outBinds = insertResult.outBinds as { newDocumentId: number[] | number };
    if (Array.isArray(outBinds.newDocumentId)) {
      return Number(outBinds.newDocumentId[0]);
    }
    return Number(outBinds.newDocumentId);
  }

  private async getNextVersionNo(
    connection: oracledb.Connection,
    documentId: number,
  ): Promise<number> {
    const result = await connection.execute<MaxVersionRow>(
      `
      SELECT NVL(MAX(version_no), 0) AS "maxVersionNo"
      FROM document_versions
      WHERE document_id = :documentId
      `,
      { documentId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: false },
    );

    const max = result.rows?.[0]?.maxVersionNo ?? 0;
    return Number(max) + 1;
  }

  private async insertDocumentVersion(
    connection: oracledb.Connection,
    input: {
      documentId: number;
      versionNo: number;
      objectName: string;
      originalFilename: string;
      contentType: string;
      fileSizeBytes: number;
      checksum: string;
      uploadedByUserId: number;
      eventId: string;
    },
  ): Promise<number> {
    const insertResult = await connection.execute(
      `
      INSERT INTO document_versions (
        document_id,
        version_no,
        storage_bucket,
        storage_namespace,
        storage_object_name,
        original_filename,
        content_type,
        file_size_bytes,
        sha256_checksum,
        uploaded_by_user_id,
        upload_source,
        webhook_event_id,
        is_current
      ) VALUES (
        :documentId,
        :versionNo,
        :storageBucket,
        :storageNamespace,
        :storageObjectName,
        :originalFilename,
        :contentType,
        :fileSizeBytes,
        :checksum,
        :uploadedByUserId,
        'WEBHOOK',
        :eventId,
        1
      )
      RETURNING version_id INTO :newVersionId
      `,
      {
        documentId: input.documentId,
        versionNo: input.versionNo,
        storageBucket: this.config.getOrThrow<string>('OCI_BUCKET_NAME'),
        storageNamespace: this.config.getOrThrow<string>('OCI_OBJECT_NAMESPACE'),
        storageObjectName: input.objectName,
        originalFilename: input.originalFilename,
        contentType: input.contentType,
        fileSizeBytes: input.fileSizeBytes,
        checksum: input.checksum,
        uploadedByUserId: input.uploadedByUserId,
        eventId: input.eventId,
        newVersionId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: false },
    );

    const outBinds = insertResult.outBinds as { newVersionId: number[] | number };
    if (Array.isArray(outBinds.newVersionId)) {
      return Number(outBinds.newVersionId[0]);
    }
    return Number(outBinds.newVersionId);
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180);
}
