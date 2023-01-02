import { Injectable } from '@nestjs/common';
import { CreateImageDto } from 'src/dto/image.dto';

@Injectable()
export class StorageService {
  async upload(image: any): Promise<CreateImageDto> {
    return await {
      format: 'image',
      sourceName: 'source',
      regularName: 'regular',
      sourceSize: 1265,
      compdSize: 756,
      location: '',
    };
  }
}
