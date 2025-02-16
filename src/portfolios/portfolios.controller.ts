import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { CurrentUser } from '../decorator/user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Portfolios')
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfolioService: PortfoliosService) {}

  @Post()
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '새 포트폴리오 생성' })
  @ApiBody({ type: CreatePortfolioDto })
  createPortfolio(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @CurrentUser() user: User,
  ) {
    return this.portfolioService.createPortfolio(createPortfolioDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 포트폴리오 불러오기' })
  @ApiParam({ name: 'id', description: '포트폴리오 ID', example: 1 })
  getPortfolioById(@Param('id') id: number) {
    return this.portfolioService.getPortfolioById(id);
  }

  @Patch(':id')
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '기존 포트폴리오 수정' })
  @ApiParam({ name: 'id', description: '포트폴리오 ID', example: 1 })
  @ApiBody({ type: UpdatePortfolioDto })
  updatePortfolio(
    @Param('id') id: number,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @CurrentUser() user: User,
  ) {
    return this.portfolioService.updatePortfolio(id, updatePortfolioDto);
  }

  @Delete(':id')
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '포트폴리오 제거' })
  @ApiParam({ name: 'id', description: '포트폴리오 ID', example: 1 })
  deletePortfolio(@Param('id') id: number, @CurrentUser() user: User) {
    return this.portfolioService.deletePortfolio(id, user);
  }
}
