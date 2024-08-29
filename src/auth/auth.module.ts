import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './naver.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, NaverStrategy],
})
export class AuthModule {}
