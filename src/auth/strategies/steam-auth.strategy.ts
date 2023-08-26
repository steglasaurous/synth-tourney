import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { UserService } from '../../users/services/user.service';
import { AuthSource } from '../../users/entities/user-auth-source.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SteamAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      returnURL: 'http://localhost:3000/auth/steam/return',
      realm: 'http://localhost:3000/',
      apiKey: '', // FIXME: Put API key here from config.
    });
  }

  // Called upon successful validation - we use this to 'register' this user with our db.
  async validate(identifier: string, profile: any, done) {
    console.log('identifier', identifier);
    console.log('profile', profile);

    return await this.userService.loginUser(
      AuthSource.STEAM,
      identifier,
      profile.displayName,
      profile,
    );
  }
}
