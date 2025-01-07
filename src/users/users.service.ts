import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly userRepo: UserRepository) {}

  async getById(id: string) {
    const user = await this.userRepo.findById(id);
    const _user = user ? user.toResponseObject() : undefined;
    return _user;
  }
}
