import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { OauthUserDto } from './dto/oauth-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signIn(dto: OauthUserDto) {
    try {
      let user = await this.userRepo.findOne({
        where: { userId: dto.userId },
      });

      if (!user) {
        user = await this.signUp(dto);
      }

      user.updateVisitedAt();
      await this.userRepo.save(user);

      // JWT 토큰 생성
      const payload = {
        sub: user.id,
        userId: user.userId,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      user.refresh_token = refreshToken;
      await this.userRepo.save(user);

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async signUp(dto: OauthUserDto) {
    return await this.userRepo.save(dto);
  }
}
