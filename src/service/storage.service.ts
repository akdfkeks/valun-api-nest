import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import * as sharp from 'sharp';
import { CreateImageDto } from 'src/dto/image.dto';

@Injectable()
export class StorageService {
  private storage: S3;
  constructor() {}

  onModuleInit() {
    this.storage = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_KEY as string,
      region: 'ap-northeast-2',
    });
  }

  async upload(file: Express.Multer.File): Promise<CreateImageDto> {
    if (!file) throw new BadRequestException('사진이 없습니다.');
    // if file is not typeof image
    const { size, originalname } = file;
    const format = path.extname(originalname);
    const regularName = new Date().valueOf() + format;
    const compedFileBuffer = await this.compress(file.buffer);

    try {
      const uploaded = await this.storage
        .upload({
          Bucket: process.env.BUCKET_NAME as string,
          Key: regularName,
          Body: compedFileBuffer,
        })
        .promise();
      return {
        format,
        sourceName: originalname,
        regularName,
        sourceSize: size,
        compdSize: compedFileBuffer.byteLength,
        location: uploaded.Location,
      };
    } catch (err) {
      // console.log(err);
      throw err;
    }
  }

  private compress(image: Buffer) {
    try {
      return sharp(image).withMetadata().resize({ width: 1920 }).toBuffer();
    } catch (err) {
      throw new InternalServerErrorException('이미지 압축 실패');
    }
  }
}
