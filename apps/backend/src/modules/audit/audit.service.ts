import { Injectable } from '@nestjs/common';
import { OracleService } from '../../integrations/oracle/oracle.service';
import oracledb from 'oracledb';

interface AuditEntry {
  userId: number;
  documentId: number;
  versionId: number;
  actionType: 'VIEW' | 'DOWNLOAD' | 'ADMIN_UPDATE' | 'WEBHOOK_UPLOAD';
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly oracle: OracleService) {}

  async log(entry: AuditEntry) {
    await this.oracle.executeDml(
      `
      INSERT INTO access_logs (
        user_id,
        document_id,
        version_id,
        action_type,
        ip_address,
        user_agent,
        request_id
      ) VALUES (
        :userId,
        :documentId,
        :versionId,
        :actionType,
        :ipAddress,
        :userAgent,
        :requestId
      )
      `,
      entry,
    );
  }

  async logWithConnection(connection: oracledb.Connection, entry: AuditEntry) {
    await connection.execute(
      `
      INSERT INTO access_logs (
        user_id,
        document_id,
        version_id,
        action_type,
        ip_address,
        user_agent,
        request_id
      ) VALUES (
        :userId,
        :documentId,
        :versionId,
        :actionType,
        :ipAddress,
        :userAgent,
        :requestId
      )
      `,
      entry,
      { autoCommit: false },
    );
  }
}
