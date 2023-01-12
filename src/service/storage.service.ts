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
  constructor() {
    this.storage = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_KEY as string,
      region: 'ap-northeast-2',
    });
  }

  onModuleInit() {}

  public async upload(
    file: Express.Multer.File,
    options?: UploadOptions,
  ): Promise<CreateImageDto> {
    // 에러처리 싹다 고쳐야할듯
    if (!file)
      throw new BadRequestException(
        '(.jpeg, .jpg, .png) 형식의 사진을 첨부해야합니다.',
      );
    const { size: sourceSize, originalname: sourceName } = file;
    const ext = path.extname(sourceName);
    if (!['.jpeg', 'jpg', 'png'].includes(ext))
      throw new BadRequestException(
        '(.jpeg, .jpg, .png) 형식의 사진만 사용할 수 있습니다.',
      );
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
      console.log(err);
      throw new InternalServerErrorException('사진 업로드 실패');
    }
  }

  private resizeImage(
    image: Express.Multer.File,
    options: { width?: number; height?: number },
  ) {
    // Bug: input 작으면 이미지가 커지는 문제가 있음
    try {
      return sharp(image.buffer).withMetadata().resize(options).toBuffer();
    } catch (err) {
      throw new InternalServerErrorException('사진 압축 실패');
    }
  }
}
