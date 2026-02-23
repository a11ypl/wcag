import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { ClientController } from './modules/client/client.controller';
import { DocumentsService } from './modules/documents/documents.service';
import { WebhooksController } from './modules/webhooks/webhooks.controller';
import { WebhooksService } from './modules/webhooks/webhooks.service';
import { JwtTokenService } from './common/jwt-token.service';
import { OracleService } from './integrations/oracle/oracle.service';
import { OciObjectStorageService } from './integrations/oci/object-storage.service';
import { AuditService } from './modules/audit/audit.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AuthController, ClientController, WebhooksController],
  providers: [
    JwtTokenService,
    AuthService,
    OracleService,
    OciObjectStorageService,
    DocumentsService,
    WebhooksService,
    AuditService,
  ],
})
export class AppModule {}
