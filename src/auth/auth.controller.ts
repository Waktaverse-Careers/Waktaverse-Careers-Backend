import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { NaverAuthGuard } from './naver.guard';
import { OauthUserDto } from './dto/oauth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NaverAuthGuard)
  @Get('naver')
  async login() {}

  @UseGuards(NaverAuthGuard)
  @Get('naver/callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.signIn(req.user as OauthUserDto);
    res.send(result);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
}
