import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { R2File } from './entities/r2.entity';

@Injectable()
export class R2Service {
  private s3Client: S3Client;
  private bucketName: string; // R2 버킷 이름
  private r2Domain: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('R2_REGION'), // R2 지역 설정
      endpoint: this.configService.get<string>('R2_ENDPOINT'), // R2 엔드포인트 (ex: https://<account-id>.r2.cloudflarestorage.com)
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'), // R2 액세스 키
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY'), // R2 비밀 키
      },
    });
    this.bucketName = 'waktaverse-careers';
    this.r2Domain = this.configService.get<string>('R2_DOMAIN');
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<R2File> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
    const url = `${this.r2Domain}/${key}`;
    return { key, url };
  }

  async uploadFiles(
    files: Array<{
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    }>,
    prefix: string = 'uploads',
  ): Promise<Array<{ key: string; url: string }>> {
    const uploadPromises = files.map((file) => {
      const key = `${prefix}/${Date.now()}-${file.originalname}`;
      return this.uploadFile(key, file.buffer, file.mimetype);
    });

    return await Promise.all(uploadPromises);
  }

  async downloadFile(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }
}
