import { ApiProperty } from '@nestjs/swagger';
import { PortfolioVisibility } from '../entities/portfolio.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePortfolioDto {
  @ApiProperty({
    name: 'currentVersion',
    type: 'int',
    nullable: true,
    default: null,
    required: false,
  })
  @IsOptional()
  @IsNumber({})
  currentVersion?: number | null = null;

  @ApiProperty({
    name: 'visibility',
    type: 'enum',
    enum: ['public', 'partial', 'private'],
    default: 'private',
    required: false,
  })
  @IsOptional()
  @IsString()
  visibility?: PortfolioVisibility = 'private';
}
