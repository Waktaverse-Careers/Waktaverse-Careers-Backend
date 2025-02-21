import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioVersion } from './entities/portfolio-version.entity';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { User } from '../users/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { CreatePortfolioVersionDto } from './dto/create-portfoilo-version.dto';
import {
  UpdatePortfolioVersionDto,
  UpdateStatusVersionDto,
} from './dto/update-portfolio-version.dto';

@Injectable()
export class PortfoliosService {
  private readonly logger = new Logger(PortfoliosService.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(PortfolioVersion)
    private readonly versionRepository: Repository<PortfolioVersion>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getPortfolioByUserId(userId: number) {
    this.logger.log('사용자 ID:', userId);
    const portfolio = await this.portfolioRepository.findOne({
      where: { user: { id: userId } },
      relations: ['versions'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    // 포트폴리오와 현재 버전 정보 합치기
    const result = {
      ...portfolio,
    } as Portfolio & PortfolioVersion;

    this.logger.log('포트폴리오 조회 완료');
    return result;
  }

  async updatePortfolio(userId: number, dto: UpdatePortfolioDto) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!portfolio) {
      this.logger.warn('포트폴리오를 찾을 수 없습니다. 사용자 ID:', userId);
      throw new NotFoundException('Portfolio is Not Found');
    }

    portfolio.updateMeta(dto);

    console.log(portfolio);
    await this.portfolioRepository.save(portfolio);

    this.logger.log('포트폴리오 업데이트 완료:', portfolio);
    return portfolio;
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
    this.logger.log(`버전 생성 시작. 사용자 ID: ${portfolio.user.id}`);
    const version = this.versionRepository.create({
      portfolio,
      portfolioName: dto.portfolioName,
      description: dto.description,
      status: 'pending',
      tags: await this.handleTags(dto.tags),
      thumbnailId: dto.thumbnailId,
      content: dto.content, // 추가 컨텐츠가 있다면
    });
    const savedVersion = await this.versionRepository.save(version);
    this.logger.log('버전 생성 완료');
    return savedVersion;
  }

  async createVersion(userId: number, dto: CreatePortfolioVersionDto) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!portfolio)
      throw new NotFoundException(
        `user:#${userId}는 portfolio가 존재 하지 않음`,
      );
    const version = await this.addVersion(portfolio, dto);
    return version;
  }

  async updateVersion(userId: number, dto: UpdatePortfolioVersionDto) {
    this.logger.log(`버전 업데이트 시작. 사용자 ID: ${userId}`);
    // 사용자가 소유한 포트폴리오의 버전 찾기
    const version = await this.versionRepository.findOne({
      where: {
        portfolio: { user: { id: userId } },
        id: dto.id, // dto에서 versionId를 가져옴
      },
    });

    if (!version) {
      this.logger.warn(`versionId : ${dto.id} 가 존재하지 않음`);
      throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
    }

    const { tags, ..._dto } = dto;

    Object.assign(version, _dto);
    version.tags = await this.handleTags(tags);

    await this.versionRepository.save(version);

    this.logger.log(`버전 업데이트 완료: ${version.id}`);
    return version;
  }

  async updateStatusVersion(userId: number, dto: UpdateStatusVersionDto) {
    this.logger.log('버전 status 업데이트 시작');

    const { id, status } = dto;
    const version = await this.versionRepository.findOne({
      where: {
        portfolio: { user: { id: userId } },
        id: id, // dto에서 versionId를 가져옴
      },
    });

    if (!version) {
      this.logger.warn(`versionId : ${id} 가 존재하지 않음`);
      throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
    }

    version.status = status;
    await this.versionRepository.save(version);

    this.logger.log('버전 status 업데이트 완료:', version);
    return version;
  }

  async getPortfolio(userId: number): Promise<Portfolio> {
    const portfolio = await this.getPortfolioByUserId(userId);

    if (portfolio.visibility !== 'public') {
      throw new UnauthorizedException('공개된 포트폴리오가 아닙니다.');
    }

    return portfolio;
  }

  async getPortfolioBySharedId(sharedId: string) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { sharedId: sharedId },
      relations: ['user'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    if (portfolio.visibility === 'private') {
      throw new UnauthorizedException(
        '해당 포트폴리오에 대한 접근이 막혀있습니다.',
      );
    }

    return {
      ...portfolio,
    } as Portfolio;
  }

  // 버전 삭제 메서드 추가
  async deleteVersion(userId: number, versionId: number): Promise<void> {
    this.logger.log(
      `버전 삭제 시작. 포트폴리오 ID:
      ${userId} |
      버전 ID:
      ${versionId}`,
    );
    const version = await this.versionRepository.findOne({
      where: {
        portfolio: { user: { id: userId } },
        id: versionId,
      },
      relations: ['portfolio'],
    });

    if (!version) {
      throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
    }

    if (version.portfolio.currentVersion === versionId) {
      throw new BadRequestException('현재 공개중인 버전은 삭제 불가');
    }

    // 버전 삭제
    await this.versionRepository.remove(version);
    this.logger.log('버전 삭제 완료:', version);
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
