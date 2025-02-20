import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioVersionDto {
  @ApiProperty({
    description: '포트폴리오 이름',
    example: '왁타버스 포폴',
    required: true,
  })
  @IsString()
  portfolioName: string;

  @ApiProperty({
    description: '포트폴리오 설명',
    example: '이것은 모시깽이한 포폴입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '포트폴리오 내용 데이터 ',
    example: { data: 'data' },
    required: true,
  })
  @IsOptional()
  content: JSON;

  @ApiProperty({
    description: '포트폴리오 썸네일 id ',
    example: '/thumbnail/123.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnailId?: string;

  @ApiProperty({
    description: '포트폴리오 태그',
    example: ['일러스트', '비챤'],
  })
  @IsOptional({ each: true })
  @IsArray()
  tags?: string[];
}
