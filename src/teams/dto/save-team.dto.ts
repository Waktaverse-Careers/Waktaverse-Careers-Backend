import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PeopleData, TeamType } from '../entities/team.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SaveTeamDto {
  @ApiProperty({
    example: 'MU-12',
    description: 'Team 의 고유 id',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: true,
    description: '검수가 완료된 팀인지 확인',
    required: true,
  })
  @IsBoolean()
  visible: boolean;

  @ApiProperty({
    example: '노래',
    description: '팀의 타입',
    required: true,
  })
  @IsString()
  type: TeamType;

  @ApiProperty({
    example: '왁타버스뮤직',
    description: '팀의 이름',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "['아이돌','팬메이드']",
    description: 'keyword 배열 형식 string으로 변환',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    example: '2024.01.25',
    description: '팀의 공개 시간',
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({
    example: '왁타버스 작업계를 위한 사이트',
    description: '간단한 팀의 소개 혹은 슬로건',
  })
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiProperty({
    example: [{ name: '릴파', role: ['보컬', '귀여움'] }],
    description: '팀원들의 정보',
    required: true,
  })
  @IsObject()
  people: PeopleData[];

  @ApiProperty({
    example: "['https://...', 'https://...']",
    description: '후기 게시글 주소',
  })
  @IsOptional()
  @IsString()
  review_url?: string;

  @ApiProperty({
    example: "['https://...', 'https://...']",
    description: '참조 주소',
  })
  @IsOptional()
  @IsString()
  reference_url?: string;
}
