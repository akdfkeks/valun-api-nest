import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
  ValidationError,
} from 'class-validator';

export class CreateUserDto {
  @Length(4, 30, {
    message: 'ID는 4자 이상 30자 미만으로 구성해야 합니다.',
  })
  @IsString()
  id: string;

  @Length(4, 30, {
    message: '비밀번호는 4자 이상 30자 미만으로 구성해야 합니다.',
  })
  @IsString()
  pw: string;

  @Length(2, 30)
  @IsString({ message: '이름은 한글 및 영어만 사용 가능합니다.' })
  name: string;

  @Length(2, 30, {
    message: '닉네임은 2자 이상 30자 미만으로 구성해야 합니다.',
  })
  @IsString()
  nick: string;
}

export class UserLoginDto {
  @IsString()
  id: string;

  @Length(4, 30)
  pw: string;
}