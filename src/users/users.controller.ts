import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info/:id')
  async getUserInfo(@Param('id') id: string) {
    return await this.usersService.getById(parseInt(id, 10));
  }

  @Put('profile')
  async updateProfile(@Body() body: UpdateProfileDto) {
    await this.usersService.updateProfile(body.id, body.profile);
  }
}
