import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioVersion } from './entities/portfolio-version.entity';
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

  async getPortfolioByUserId(userId: number) {
    console.log('------------------------', userId);
    const portfolio = await this.portfolioRepository.findOne({
      where: { user: { id: userId } },
      relations: ['versions'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    // 현재 활성화된 버전 정보 조회
    const currentVersion = await this.versionRepository.findOne({
      where: {
        id: portfolio.currentVersion,
      },
    });

    // 포트폴리오와 현재 버전 정보 합치기
    return {
      ...portfolio,
      ...currentVersion,
    } as Portfolio & PortfolioVersion;
  }

  async updatePortfolio(userId: number, dto: UpdatePortfolioDto) {
    const portfoilo = await this.portfolioRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!portfoilo) throw new NotFoundException('Portfolio is Not Found');

    await this.portfolioRepository.update(portfoilo.id, dto);

    return await this.portfolioRepository.findOne({
      where: { user: { id: userId } },
    });
  }

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

  private async addVersion(
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

  async createVersion(userId: number, dto: CreatePortfolioVersionDto) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { user: { id: userId } },
    });
    const version = await this.addVersion(portfolio, dto);
    return await this.versionRepository.save(version);
  }

  async updateVersion(userId: number, dto: UpdatePortfolioVersionDto) {
    // 사용자가 소유한 포트폴리오의 버전 찾기
    const version = await this.versionRepository.findOne({
      where: {
        portfolio: { user: { id: userId } },
        id: dto.id, // dto에서 versionId를 가져옴
      },
    });

    if (!version) {
      throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
    }

    const tags = await this.handleTags(dto.tags);

    await this.versionRepository.update(version.id, { ...dto, tags });

    return await this.versionRepository.findOne({ where: { id: version.id } });
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
