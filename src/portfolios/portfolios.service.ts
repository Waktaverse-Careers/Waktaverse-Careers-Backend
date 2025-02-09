import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    user: User,
  ): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      user,
      works: createPortfolioDto.works.map((work) => ({ ...work })),
      tags: createPortfolioDto.tags.map((tagName) => ({ name: tagName })),
    });
    return this.portfolioRepository.save(portfolio);
  }

  async getPortfolioById(id: number): Promise<Portfolio> {
    try {
      const portfolio = await this.portfolioRepository.findOne({
        where: { id },
        relations: ['works', 'tags', 'user'],
      });

      if (!portfolio) {
        throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
      }
      return portfolio;
    } catch (error) {
      throw error;
    }
  }

  async updatePortfolio(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
    user: User,
  ): Promise<Portfolio> {
    const portfolio = await this.getPortfolioById(id);
    // if (portfolio.user.id !== user.id) {
    //   throw new UnauthorizedException('수정 권한이 없습니다.');
    // }
    Object.assign(portfolio, updatePortfolioDto);
    return this.portfolioRepository.save(portfolio);
  }

  async deletePortfolio(id: number, user: User): Promise<void> {
    const portfolio = await this.getPortfolioById(id);
    // if (portfolio.user.id !== user.id) {
    //   throw new UnauthorizedException('삭제 권한이 없습니다.');
    // }
    await this.portfolioRepository.remove(portfolio);
  }
}
