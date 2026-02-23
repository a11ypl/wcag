import { IsIn, IsString, MaxLength } from 'class-validator';

export class WebhookUploadDto {
  @IsIn(['REFERENCE', 'CERTIFICATE', 'TRAINER_PROFILE', 'BIO', 'CV', 'OFFERING'])
  docType!: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsIn(['PUBLIC_CLIENTS', 'STANDARD_AND_PREMIUM', 'PREMIUM_ONLY'])
  visibilityTier!: string;

  @IsString()
  @MaxLength(80)
  sourceSystem!: string;
}
