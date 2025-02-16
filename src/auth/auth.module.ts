import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './naver.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { GoogleStrategy } from './google.strategy';
import { JwtAuthGuard } from './auth-jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, NaverStrategy, GoogleStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
