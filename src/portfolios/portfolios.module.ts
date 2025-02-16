import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { Portfolio } from './entities/portfolio.entity';
import { Tag } from './entities/tag.entity';
import { PortfolioVersion } from './entities/portfolio-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, Tag, PortfolioVersion])],
  controllers: [PortfoliosController],
  providers: [PortfoliosService],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
