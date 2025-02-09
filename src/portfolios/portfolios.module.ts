import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { Portfolio, PortfolioTag, Work } from './entities/portfolio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, PortfolioTag, Work])],
  controllers: [PortfoliosController],
  providers: [PortfoliosService],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
