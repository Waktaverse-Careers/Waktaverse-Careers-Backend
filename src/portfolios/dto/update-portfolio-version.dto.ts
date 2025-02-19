import { ApiProperty, PartialType } from '@nestjs/swagger';
import { portfolioStatusType } from '../entities/portfolio-version.entity';
import { CreatePortfolioVersionDto } from './create-portfoilo-version.dto';
import { IsIn, IsNumber } from 'class-validator';

export class UpdatePortfolioVersionDto extends PartialType(
  CreatePortfolioVersionDto,
) {
  @ApiProperty({
    description: 'Version Id',
    example: 123,
    required: true,
  })
  @IsNumber()
  id: number;
}

export class UpdateStatusVersionDto {
  @ApiProperty({
    description: 'Version Id',
    example: 123,
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '포트폴리오 상태',
    example: ['pending', 'approved', 'rejected', 'review'],
    required: true,
  })
  @IsIn(['pending', 'approved', 'rejected', 'review'])
  status: portfolioStatusType;
}
