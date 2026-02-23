import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../../common/auth-user';
import { OciObjectStorageService } from '../../integrations/oci/object-storage.service';
import { OracleService } from '../../integrations/oracle/oracle.service';
import { AuditService } from '../audit/audit.service';

interface DocumentListRow {
  documentId: number;
  title: string;
  docType: string;
  versionNo: number;
  updatedAt: Date;
}

interface DownloadRow {
  documentId: number;
  versionId: number;
  storageObjectName: string;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly oracle: OracleService,
    private readonly oci: OciObjectStorageService,
    private readonly audit: AuditService,
  ) {}

  async listForUser(user: AuthUser): Promise<DocumentListRow[]> {
    return this.oracle.execute<DocumentListRow>(
      `
      SELECT
        d.document_id AS "documentId",
        d.title AS "title",
        d.doc_type AS "docType",
        v.version_no AS "versionNo",
        v.created_at AS "updatedAt"
      FROM documents d
      JOIN document_versions v
        ON v.version_id = d.current_version_id
      WHERE d.is_active = 1
        AND (
          :roleCode = 'ADMIN'
          OR (:roleCode = 'CLIENT_STANDARD' AND d.visibility_tier IN ('PUBLIC_CLIENTS', 'STANDARD_AND_PREMIUM'))
          OR (:roleCode = 'CLIENT_PREMIUM' AND d.visibility_tier IN ('PUBLIC_CLIENTS', 'STANDARD_AND_PREMIUM', 'PREMIUM_ONLY'))
        )
        AND NOT EXISTS (
          SELECT 1
          FROM document_acl acl
          WHERE acl.document_id = d.document_id
            AND acl.user_id = :userId
            AND acl.can_view = 0
        )
      ORDER BY d.updated_at DESC
      `,
      {
        userId: user.userId,
        roleCode: user.roleCode,
      },
    );
  }

  async createDownloadForUser(input: {
    user: AuthUser;
    documentId: number;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
  }): Promise<{ downloadUrl: string; expiresAt: string }> {
    const rows = await this.oracle.execute<DownloadRow>(
      `
      SELECT
        d.document_id AS "documentId",
        v.version_id AS "versionId",
        v.storage_object_name AS "storageObjectName"
      FROM documents d
      JOIN document_versions v
        ON v.version_id = d.current_version_id
      WHERE d.document_id = :documentId
        AND d.is_active = 1
        AND (
          :roleCode = 'ADMIN'
          OR (:roleCode = 'CLIENT_STANDARD' AND d.visibility_tier IN ('PUBLIC_CLIENTS', 'STANDARD_AND_PREMIUM'))
          OR (:roleCode = 'CLIENT_PREMIUM' AND d.visibility_tier IN ('PUBLIC_CLIENTS', 'STANDARD_AND_PREMIUM', 'PREMIUM_ONLY'))
        )
        AND NOT EXISTS (
          SELECT 1
          FROM document_acl acl
          WHERE acl.document_id = d.document_id
            AND acl.user_id = :userId
            AND acl.can_view = 0
        )
      FETCH FIRST 1 ROWS ONLY
      `,
      {
        documentId: input.documentId,
        roleCode: input.user.roleCode,
        userId: input.user.userId,
      },
    );

    if (!rows[0]) {
      const exists = await this.oracle.execute<{ documentId: number }>(
        `
        SELECT document_id AS "documentId"
        FROM documents
        WHERE document_id = :documentId
        FETCH FIRST 1 ROWS ONLY
        `,
        { documentId: input.documentId },
      );

      if (!exists[0]) {
        throw new NotFoundException('Document not found');
      }
      throw new ForbiddenException('Access denied');
    }

    const record = rows[0];
    const preauth = await this.oci.createPreAuthenticatedUrl({
      objectName: record.storageObjectName,
      expiresInMinutes: 5,
    });

    await this.audit.log({
      userId: input.user.userId,
      documentId: record.documentId,
      versionId: record.versionId,
      actionType: 'DOWNLOAD',
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      requestId: input.requestId,
    });

    return {
      downloadUrl: preauth.url,
      expiresAt: preauth.expiresAt,
    };
  }
}
