import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { OauthUserDto } from './dto/oauth-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signIn(dto: OauthUserDto) {
    try {
      let user = await this.userRepo.findOne({
        select: { id: true },
        where: { userId: dto.userId, provider: dto.provider },
      });

      if (!user) {
        user = await this.signUp({ ...dto });
        this.logger.log(
          `SignUp User : ${user.id} | ${user.userId} |${user.nickname}`,
        );
      }
      return await this.updateLoginToken(user.id);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async signUp(dto: OauthUserDto) {
    return await this.userRepo.save(dto);
  }

  async updateLoginToken(id: number) {
    const JWT_SECRET = this.config.get<string>('JWT_SECRET');
    const JWT_REFRESH_SECRET = this.config.get<string>('JWT_REFRESH_SECRET');

    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user || user.role === 'ban') {
      throw new NotFoundException('올바르지 않은 유저입니다.');
    }

    const payload = {
      sub: user.id,
      userId: user.userId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    this.logger.log(
      `Set Token : ${user.id} | ${user.userId} |${user.nickname}`,
    );
    await this.updateRefresh(user.id, refreshToken);

    this.logger.log(
      `SignIn User : ${user.id} | ${user.userId} | ${user.nickname}`,
    );

    return { user: user.toResponseObject(), accessToken, refreshToken };
  }

  async updateRefresh(id: number, refreshToken: string) {
    await this.userRepo.update(id, {
      refreshToken: refreshToken,
      visitedAt: new Date(),
    });
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepo.findOne({
        where: { id: decoded.sub },
        select: {
          id: true,
          userId: true,
          refreshToken: true,
        },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = {
        sub: user.id,
        userId: user.userId,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      });

      const newRefreshToken = this.jwtService.sign(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      await this.updateRefresh(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
