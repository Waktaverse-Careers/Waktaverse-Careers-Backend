import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth-jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '로그인한 user info 요청',
    description: '사용자 자신의 정보를 가져오는 api',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyInfo(@CurrentUser() user) {
    return await this.usersService.getById(user.id);
  }

  @ApiOperation({
    summary: 'user info 요청',
    description: '사용자의 정보를 가져오는 api',
  })
  @Get('info/:id')
  async getUserInfo(@Param('id') id: string) {
    return await this.usersService.getById(parseInt(id, 10));
  }

  @ApiOperation({
    summary: 'user 정보 수정 요청',
    description: '사용자의 정보를 수정하는 api',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto,
    description: '수정할 사용자 정보',
  })
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@CurrentUser() user, @Body() body: UpdateUserDto) {
    console.log(user, body);
    return await this.usersService.updateUser(user.id, body);
  }
}
