import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'], //성공시 받을 데이터
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    try {
      const user = {
        userId: profile.id,
        nickname: profile.displayName,
        profile_img: profile.photos[0].value,
        provider: 'google',
      };
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
}
