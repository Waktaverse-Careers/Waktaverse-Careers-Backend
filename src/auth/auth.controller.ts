import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { NaverAuthGuard } from './naver.guard';
import { OauthUserDto } from './dto/oauth-user.dto';
import { GoogleAuthGuard } from './google.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '네이버 로그인 요청',
    description: '네이버 로그인 페이지로 리다이렉트합니다.',
  })
  @UseGuards(NaverAuthGuard)
  @Get('naver')
  async naverLogin() {}

  @ApiOperation({
    summary: '네이버 로그인 콜백',
    description: '네이버 OAuth 인증 후 사용자 정보를 처리합니다.',
  })
  @ApiResponse({ status: 200, description: '로그인 성공', type: OauthUserDto })
  @UseGuards(NaverAuthGuard)
  @Get('naver/callback')
  async naverCallback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.signIn(req.user as OauthUserDto);
    res.send(result);
  }

  @ApiOperation({
    summary: '구글 로그인 요청',
    description: '구글 로그인 페이지로 리다이렉트합니다.',
  })
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleLogin() {}

  @ApiOperation({
    summary: '구글 로그인 콜백',
    description: '구글 OAuth 인증 후 사용자 정보를 처리합니다.',
  })
  @ApiResponse({ status: 200, description: '로그인 성공', type: OauthUserDto })
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.signIn(req.user as OauthUserDto);
    res.send(result);
  }

  @ApiOperation({
    summary: '리프레시 토큰 요청',
    description:
      '유효한 리프레시 토큰을 사용해 새로운 액세스 토큰을 발급받습니다.',
  })
  @ApiBody({ schema: { example: { refreshToken: 'your-refresh-token' } } })
  @ApiResponse({ status: 200, description: '새로운 액세스 토큰 반환' })
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
}
