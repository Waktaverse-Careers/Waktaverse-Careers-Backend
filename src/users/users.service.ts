import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { Logger } from '@nestjs/common';
import { ProfileData } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly userRepo: UserRepository) {}

  async getById(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new BadRequestException();

    return user.toResponseObject();
  }

  async updateUser(id, dto: UpdateUserDto) {
    await this.userRepo.updateUser(id, dto);
  }

  async deleteUser(id: number) {
    await this.userRepo.deleteUser(id);
  }
}
