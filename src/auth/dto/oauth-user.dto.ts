import { IsString } from 'class-validator';

export class OauthUserDto {
  @IsString()
  userId: string;

  @IsString()
  nickname: string;

  @IsString()
  provider: string;

  @IsString()
  profile_img: string;
}
