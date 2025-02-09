import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { User } from '../users/entities/user.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    user: User,
  ): Promise<Portfolio> {
    const tags = await Promise.all(
      createPortfolioDto.tags?.map(async (tagName) => {
        let tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });

        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          tag = await this.tagRepository.save(tag);
        }

        return tag;
      }),
    );

    const portfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      user,
      tags,
    });

    return this.portfolioRepository.save(portfolio);
  }

  async getPortfolioById(id: number): Promise<Portfolio> {
    try {
      const portfolio = await this.portfolioRepository.findOne({
        where: { id },
        relations: ['tags', 'user'],
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

    const tags = updatePortfolioDto.tags || [];
    const unique = Array.from(new Set(tags));

    portfolio.tags = await Promise.all(
      unique?.map(async (tagName) => {
        let tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });

        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          tag = await this.tagRepository.save(tag);
        }

        return tag;
      }),
    );

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
