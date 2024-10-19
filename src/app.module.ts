import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SheetsModule } from './sheets/sheets.module';

@Module({
  // from .env File
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    AuthModule,

    SheetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
