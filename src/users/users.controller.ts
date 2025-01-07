import { Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserInfo(@Param('id') id: string) {
    return await this.usersService.getById(id);
  }
}
