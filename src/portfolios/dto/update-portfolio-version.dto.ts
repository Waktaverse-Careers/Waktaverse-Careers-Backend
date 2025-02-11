import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePortfolioDto } from './create-portfolio.dto';
import { portfolioStatusType } from '../entities/portfolio-version.entity';

export class UpdatePortfolioVersionDto extends PartialType(CreatePortfolioDto) {
  @ApiProperty({
    description: '포트폴리오 상태',
    example: '/thumbnail/123.jpg',
    required: false,
  })
  status: portfolioStatusType;

  @ApiProperty({})
  isCurrent?: boolean;
}
