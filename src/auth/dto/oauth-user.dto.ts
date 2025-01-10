import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OauthUserDto {
  @ApiProperty({
    example: 'adskavmb...',
    description: 'provider에서 제공된 id',
    required: true,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: '냐무냠',
    description: '닉네임',
    required: true,
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 'naver',
    description: 'provider oauth',
    required: true,
  })
  @IsString()
  provider: string;

  @ApiProperty({
    example: 'https://...',
    description: 'profile img url 주소',
    required: true,
  })
  @IsString()
  profile_img: string;
}
