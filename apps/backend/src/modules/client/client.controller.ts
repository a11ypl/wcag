import {
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { DocumentsService } from '../documents/documents.service';

@Controller('/api/client')
export class ClientController {
  constructor(
    private readonly authService: AuthService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Get('/documents')
  async listDocuments(@Headers('authorization') authorization?: string) {
    const user = this.authService.requireUserFromAuthorizationHeader(authorization);
    return this.documentsService.listForUser(user);
  }

  @Post('/documents/:documentId/download')
  async createDownload(
    @Param('documentId', ParseIntPipe) documentId: number,
    @Headers('authorization') authorization: string | undefined,
    @Req() req: Request,
  ) {
    const user = this.authService.requireUserFromAuthorizationHeader(authorization);

    return this.documentsService.createDownloadForUser({
      user,
      documentId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
      requestId: req.get('x-request-id') ?? undefined,
    });
  }
}
