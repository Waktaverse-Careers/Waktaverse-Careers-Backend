import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { NaverAuthGuard } from './naver.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NaverAuthGuard)
  @Get('naver')
  async login() {}

  @UseGuards(NaverAuthGuard)
  @Get('naver/callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    res.send(req.user);
  }
}
