import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/decorator/user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'user info 요청',
    description: '사용자의 정보를 가져오는 api',
  })
  @Get('info/:id')
  async getUserInfo(@Param('id') id: string) {
    return await this.usersService.getById(parseInt(id, 10));
  }

  @ApiOperation({
    summary: 'user profile 수정 요청',
    description: '사용자의 프로필 정보를 수정하는 api',
  })
  @Put('profile')
  async updateProfile(@Body() body: UpdateProfileDto, @CurrentUser() user) {
    await this.usersService.updateProfile(user.id, body.profile);
  }
}
