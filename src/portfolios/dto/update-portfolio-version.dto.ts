import { ApiProperty, PartialType } from '@nestjs/swagger';
import { portfolioStatusType } from '../entities/portfolio-version.entity';
import { CreatePortfolioVersionDto } from './create-portfoilo-version.dto';

export class UpdatePortfolioVersionDto extends PartialType(
  CreatePortfolioVersionDto,
) {
  @ApiProperty({
    description: 'Version Id',
    example: 123,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '포트폴리오 상태',
    example: ['pending', 'approved', 'rejected', 'review'],
    required: false,
  })
  status: portfolioStatusType;
}
