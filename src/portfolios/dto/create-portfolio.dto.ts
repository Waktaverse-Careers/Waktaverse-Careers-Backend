import { IsString, IsArray, IsOptional, IsEnum, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PortfolioVisibility } from '../entities/portfolio.entity';
import { CreatePortfolioVersionDto } from './create-portfoilo-version.dto';

export class CreatePortfolioDto extends CreatePortfolioVersionDto {
  @ApiProperty({ description: '포트폴리오 이름', example: '왁타버스 포폴' })
  @IsString()
  portfolioName: string;

  @ApiProperty({
    description: '설명',
    example: '백엔드 개발자의 포트폴리오입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

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
  visibility?: PortfolioVisibility = 'private';

  @ApiProperty({
    description: '포트폴리오 JSON data',
    type: 'json',
    required: true,
  })
  @IsJSON()
  content: JSON;

  @ApiProperty({
    description: '포트폴리오 태그',
    default: [],
  })
  tags: string[] = [];
}
