import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export interface ProfileData {
  description?: string;
  contacts?: string[];
  tech?: string[];
}

export class UpdateProfileDto {
  @ApiProperty({
    example: {
      description: '나에대한 설명을 적는곳',
      contacts: ['discord:iq_eq', 'youtube:https://...'],
      tech: ['pr:100', 'blender:40'],
    },
    description: 'profile을 대한 정보를 json형태로 저장',
  })
  @IsNotEmpty()
  @IsObject()
  profile: ProfileData;
}
