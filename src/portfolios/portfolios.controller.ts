import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { CurrentUser } from '../decorator/user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePortfolioVersionDto } from './dto/create-portfoilo-version.dto';
import { UpdatePortfolioVersionDto } from './dto/update-portfolio-version.dto';

@ApiTags('Portfolios')
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfolioService: PortfoliosService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyPortfolio(@CurrentUser() user) {
    return await this.portfolioService.getPortfolioByUserId(user.id);
  }

  @Post('version')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 포트폴리오 버전 생성' })
  @ApiBody({ type: CreatePortfolioVersionDto })
  async createPortfolioVersion(
    @Body() dto: CreatePortfolioVersionDto,
    @CurrentUser() user: User,
  ) {
    return await this.portfolioService.createVersion(user.id, dto);
  }

  @Put('version')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '포트폴리오 버전 수정' })
  @ApiBody({ type: UpdatePortfolioVersionDto })
  async updatePortfolioVersion(
    @Body() dto: UpdatePortfolioVersionDto,
    @CurrentUser() user: User,
  ) {
    return await this.portfolioService.updateVersion(user.id, dto);
  }

  // 추후 포트폴리오 공개상태에 따른 수정 진행
  @Get(':id')
  @ApiOperation({ summary: 'ID로 포트폴리오 불러오기' })
  @ApiParam({ name: 'id', description: '포트폴리오 ID', example: 1 })
  async getPortfolioById(@Param('id') id: number) {
    return await this.portfolioService.getPortfolioById(id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '자신의 포트폴리오 메타 정보 수정' })
  @ApiBody({ type: UpdatePortfolioDto })
  async updatePortfolio(
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @CurrentUser() user: User,
  ) {
    return await this.portfolioService.updatePortfolio(
      user.id,
      updatePortfolioDto,
    );
  }

  @Delete('version/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '자신의 포트폴리오 버전 삭제' })
  @ApiParam({
    name: 'id',
    description: '삭제할 포트폴리오 버전 ID',
    example: 1,
  })
  async deletePortfolioVersion(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ) {
    await this.portfolioService.deleteVersion(user.id, id);
    return true;
  }
}
