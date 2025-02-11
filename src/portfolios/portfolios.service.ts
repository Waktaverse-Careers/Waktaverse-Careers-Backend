import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioVersion } from './entities/portfolio-version.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { User } from '../users/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { CreatePortfolioVersionDto } from './dto/create-portfoilo-version.dto';
import { UpdatePortfolioVersionDto } from './dto/update-portfolio-version.dto';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(PortfolioVersion)
    private readonly versionRepository: Repository<PortfolioVersion>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  private async handleTags(tagNames: string[]) {
    const unique = Array.from(new Set(tagNames || []));
    return Promise.all(
      unique.map(async (tagName) => {
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
  }

  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    user: User,
  ): Promise<Portfolio> {
    // portfolio meta data
    const portfolio = this.portfolioRepository.create({
      user,
      visibility: createPortfolioDto.visibility,
      currentVersion: 0,
    });
    await this.portfolioRepository.save(portfolio);

    const version = await this.createVersion(portfolio, createPortfolioDto);
    await this.versionRepository.save(version);

    // currentVersion 값을 업데이트
    portfolio.currentVersion = version.id;
    await this.portfolioRepository.save(portfolio);

    return this.getPortfolioById(portfolio.id);
  }

  async createVersion(
    portfolio: Portfolio,
    dto: CreatePortfolioVersionDto,
  ): Promise<PortfolioVersion> {
    return this.versionRepository.create({
      portfolio,
      portfolioName: dto.portfolioName,
      description: dto.description,
      status: 'pending',
      tags: await this.handleTags(dto.tags),
      thumbnailId: dto.thumbnailId,
      content: dto.content, // 추가 컨텐츠가 있다면
    });
  }

  async addVersion(portfolioId: number, dto: CreatePortfolioVersionDto) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });
    const version = await this.createVersion(portfolio, dto);
    return await this.versionRepository.save(version);
  }

  async updateVersion(versionId: number, dto: UpdatePortfolioVersionDto) {
    const tags = await this.handleTags(dto.tags);

    await this.versionRepository.update(versionId, { ...dto, tags });

    return await this.versionRepository.findOne({ where: { id: versionId } });
  }

  async getPortfolioById(id: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    // 현재 활성화된 버전 정보 조회
    const currentVersion = await this.versionRepository.findOne({
      where: {
        portfolio: { id },
      },
      relations: ['tags'],
    });

    // 포트폴리오와 현재 버전 정보 합치기
    return {
      ...portfolio,
      portfolioName: currentVersion.portfolioName,
      description: currentVersion.description,
      tags: currentVersion.tags,
      thumbnailId: currentVersion.thumbnailId,
      content: currentVersion.content,
    } as Portfolio;
  }

  async updatePortfolio(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    const tags = await this.handleTags(updatePortfolioDto.tags);

    const version = this.versionRepository.create({
      portfolio,
      portfolioName: updatePortfolioDto.portfolioName,
      description: updatePortfolioDto.description,
      status: 'pending',
      tags,
      thumbnailId: updatePortfolioDto.thumbnailId,
      content: updatePortfolioDto.content,
    });
    await this.versionRepository.save(version);

    // 포트폴리오 메타데이터 업데이트
    if (updatePortfolioDto.visibility) {
      portfolio.visibility = updatePortfolioDto.visibility;
    }
    await this.portfolioRepository.save(portfolio);

    return this.getPortfolioById(id);
  }

  async approveVersion(
    portfolioId: number,
    versionId: number,
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    const version = await this.versionRepository.findOne({
      where: {
        id: versionId,
      },
    });

    if (!version) {
      throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
    }

    // 버전 승인 처리
    version.status = 'approved';
    await this.versionRepository.save(version);

    await this.portfolioRepository.save(portfolio);

    return this.getPortfolioById(portfolioId);
  }

  async deletePortfolio(id: number, user: User): Promise<void> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    // 모든 버전 삭제
    await this.versionRepository.delete({ portfolio: { id } });
    // 포트폴리오 삭제
    await this.portfolioRepository.remove(portfolio);
  }

  // 버전 삭제 메서드 추가
  async deleteVersion(portfolioId: number, versionId: number): Promise<void> {
    const version = await this.versionRepository.findOne({
      where: {
        portfolio: { id: portfolioId },
      },
    });

    if (!version) {
      throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
    }

    // 버전 삭제
    await this.versionRepository.remove(version);
  }

  // 버전 리스트 조회
  async getVersionList(portfolioId: number) {
    return this.versionRepository.find({
      where: { portfolio: { id: portfolioId } },
      relations: ['tags'],
      order: { id: 'DESC' },
    });
  }
}
