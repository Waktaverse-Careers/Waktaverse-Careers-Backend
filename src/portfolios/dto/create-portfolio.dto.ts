import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PortfolioVisibility } from '../entities/portfolio.entity';

class CreateSkillDto {
  @ApiProperty({ description: '스킬 이름', example: 'nest.js' })
  @IsString()
  skillName: string;

  @ApiProperty({ description: '스킬 숙련도 (%)', example: 80 })
  @IsInt()
  percentage: number;
}

class CreateWorkDto {
  @ApiProperty({ description: '작업물 제목', example: '왁타버스 커리어즈' })
  @IsString()
  title: string;

  @ApiProperty({
    description: '작업물 태그',
    example: ['웹 개발', '프론트엔드'],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: '작업물 이미지 URL (포폴에 추가한 작업물의 썸네일)',
    example: 'https://example.com/work.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: '작업물 URL (ex: 왁물원 게시글 링크)',
    example: 'https://example.com/work',
  })
  @IsString()
  url: string;
}

export class CreatePortfolioDto {
  @ApiProperty({ description: '포트폴리오 이름', example: '왁타버스 포폴' })
  @IsString()
  portfolioName: string;

  @ApiProperty({
    description: '소개글',
    example: '저는 백엔드 개발자입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: '포트폴리오와 연관된 태그',
    example: ['개발자', '백엔드'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: '스킬 목록',
    type: [CreateSkillDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  skills?: CreateSkillDto[];

  @ApiProperty({
    description: '작업물 목록',
    type: [CreateWorkDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkDto)
  works?: CreateWorkDto[];

  @ApiProperty({
    description: '연락처',
    example: 'email@naver.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    description: '포트폴리오 썸네일 이미지 주소',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({
    description: '공개 범위 선택',
    example: 'public',
    enum: ['public', 'partial', 'private'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['public', 'partial', 'private'])
  visibility?: PortfolioVisibility = 'public';
}
