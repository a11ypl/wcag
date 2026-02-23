import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as common from 'oci-common';
import * as objectstorage from 'oci-objectstorage';

@Injectable()
export class OciObjectStorageService {
  private readonly client: objectstorage.ObjectStorageClient;
  private readonly namespaceName: string;
  private readonly bucketName: string;

  constructor(private readonly config: ConfigService) {
    const privateKey = this.config
      .get<string>('OCI_PRIVATE_KEY', '')
      .replace(/\\n/g, '\n');

    const provider = new common.SimpleAuthenticationDetailsProvider(
      this.config.getOrThrow<string>('OCI_TENANCY_OCID'),
      this.config.getOrThrow<string>('OCI_USER_OCID'),
      this.config.getOrThrow<string>('OCI_FINGERPRINT'),
      privateKey,
      undefined,
      this.config.getOrThrow<string>('OCI_REGION'),
    );

    this.client = new objectstorage.ObjectStorageClient({
      authenticationDetailsProvider: provider,
    });

    this.namespaceName = this.config.getOrThrow<string>('OCI_OBJECT_NAMESPACE');
    this.bucketName = this.config.getOrThrow<string>('OCI_BUCKET_NAME');
  }

  async uploadObject(params: {
    objectName: string;
    content: Buffer;
    contentType: string;
    checksumSha256: string;
  }): Promise<{ etag: string }> {
    try {
      const req: objectstorage.requests.PutObjectRequest = {
        namespaceName: this.namespaceName,
        bucketName: this.bucketName,
        objectName: params.objectName,
        putObjectBody: params.content,
        contentType: params.contentType,
        opcMeta: {
          checksum_sha256: params.checksumSha256,
        },
      };

      const response = await this.client.putObject(req);
      return { etag: response.etag ?? '' };
    } catch {
      throw new InternalServerErrorException('OCI upload failed');
    }
  }

  async createPreAuthenticatedUrl(params: {
    objectName: string;
    expiresInMinutes: number;
  }): Promise<{ url: string; expiresAt: string }> {
    const expiresAt = new Date(Date.now() + params.expiresInMinutes * 60 * 1000);

    const req: objectstorage.requests.CreatePreauthenticatedRequestRequest = {
      namespaceName: this.namespaceName,
      bucketName: this.bucketName,
      createPreauthenticatedRequestDetails: {
        name: `download-${params.objectName}-${Date.now()}`,
        objectName: params.objectName,
        accessType: 'ObjectRead',
        timeExpires: expiresAt,
      },
    };

    const response = await this.client.createPreauthenticatedRequest(req);
    const accessUri = response.preauthenticatedRequest?.accessUri;
    if (!accessUri) {
      throw new InternalServerErrorException('Could not create preauthenticated URL');
    }

    const region = this.config.getOrThrow<string>('OCI_REGION');
    return {
      url: `https://objectstorage.${region}.oraclecloud.com${accessUri}`,
      expiresAt: expiresAt.toISOString(),
    };
  }
}
