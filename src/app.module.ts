import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SheetsModule } from './sheets/sheets.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { TeamsModule } from './teams/teams.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { R2Module } from './r2/r2.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
        connectTimeout: 10000, // 연결 타임아웃 10초
        acquireTimeout: 10000, // 커넥션 획득 타임아웃 10초
        extra: {
          connectionLimit: 10, // 동시 연결 제한
        },
        poolSize: 10, // 커넥션 풀 크기
        pool: {
          min: 0,
          max: 10,
        },
        // 쿼리 타임아웃 설정
        options: {
          enableArithAbort: true,
          trustServerCertificate: true,
          requestTimeout: 30000, // 쿼리 타임아웃 30초
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SheetsModule,
    UsersModule,
    TeamsModule,
    PortfoliosModule,
    R2Module,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
