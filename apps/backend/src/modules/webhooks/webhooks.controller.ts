import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { WebhookUploadDto } from './dto/webhook-upload.dto';
import { WebhooksService } from './webhooks.service';

@Controller('/api/webhooks')
export class WebhooksController {
  constructor(
    private readonly config: ConfigService,
    private readonly webhooksService: WebhooksService,
  ) {}

  @Post('/documents')
  @UseInterceptors(FileInterceptor('file'))
  async pushDocument(
    @Headers('x-webhook-key') webhookKey: string | undefined,
    @Headers('x-webhook-event-id') eventId: string | undefined,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: WebhookUploadDto,
  ) {
    const expectedKey = this.config.get<string>('WEBHOOK_SHARED_SECRET');
    if (!expectedKey || !webhookKey || webhookKey !== expectedKey) {
      throw new UnauthorizedException('Invalid webhook key');
    }

    if (!eventId) {
      throw new BadRequestException('Missing X-Webhook-Event-Id');
    }

    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Missing file');
    }

    const alreadyExists = await this.webhooksService.isProcessed(eventId);
    if (alreadyExists) {
      throw new ConflictException('Duplicate event');
    }

    const result = await this.webhooksService.processDocumentEvent({
      eventId,
      file,
      payload: body,
    });

    return {
      status: 'accepted',
      documentId: result.documentId,
      versionId: result.versionId,
    };
  }
}
