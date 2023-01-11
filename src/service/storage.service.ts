import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import * as sharp from 'sharp';
import { CreateImageDto } from 'src/interface/dto/image.dto';

interface UploadOptions {
  resize?: {
    width?: number;
    height?: number;
  };
}

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

  async upload(
    file: Express.Multer.File,
    options?: UploadOptions,
  ): Promise<CreateImageDto> {
    if (!file) throw new BadRequestException('사진이 없습니다.');
    // if file is not typeof image
    const { size: sourceSize, originalname: sourceName } = file;
    const ext = path.extname(sourceName);
    const regularName = new Date().valueOf() + ext;
    const resizedImageBuffer = await this.resizeImage(file, options.resize);

    try {
      const uploaded = await this.storage
        .upload({
          Bucket: process.env.BUCKET_NAME as string,
          Key: regularName,
          Body: resizedImageBuffer,
        })
        .promise();
      // @TODO : logging
      return {
        format: ext,
        sourceName,
        regularName,
        sourceSize,
        compdSize: resizedImageBuffer.byteLength,
        location: uploaded.Location,
      };
    } catch (err) {
      // console.log(err);
      throw err;
    }
  }

  private resizeImage(
    image: Express.Multer.File,
    options: { width?: number; height?: number },
  ) {
    // 애초에 input 작으면 이미지가 커지는 문제
    try {
      return sharp(image.buffer).withMetadata().resize(options).toBuffer();
    } catch (err) {
      throw new InternalServerErrorException('이미지 압축 실패');
    }
  }
}
