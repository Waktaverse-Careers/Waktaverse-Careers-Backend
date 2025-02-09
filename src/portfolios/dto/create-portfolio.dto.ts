import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PortfolioVisibility } from '../entities/portfolio.entity';

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
    description: '작업물 이미지 ID (포폴에 추가한 작업물의 썸네일)',
    example: 'work.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageId?: string;

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
    description: '포트폴리오 썸네일 이미지 ID',
    example: 'thumbnail.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnailId?: string;

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
