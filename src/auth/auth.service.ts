import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { OauthUserDto } from './dto/oauth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async signIn(dto: OauthUserDto) {
    let user = await this.userRepo.findOne({
      where: { userId: dto.userId },
    });
    if (!user) {
      user = await this.signUp(dto);
    }
    user.updateVisitedAt();
    await this.userRepo.save(user);
    return user;
  }

  async signUp(dto: OauthUserDto) {
    return await this.userRepo.save(dto);
  }
}
