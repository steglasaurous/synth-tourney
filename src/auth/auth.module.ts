import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { SteamAuthController } from './controllers/steam-auth.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SteamAuthStrategy } from './strategies/steam-auth.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'somesecret', // FIXME: Replace with a proper secret from config
    }),
  ],
  providers: [AuthService, SteamAuthStrategy],
  controllers: [SteamAuthController, AuthController],
})
export class AuthModule {}
