import { Controller, Get, HostParam, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/steam')
export class SteamAuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  @UseGuards(AuthGuard('steam'))
  authSteamStart(@HostParam() host) {
    console.log(host);
  }

  @UseGuards(AuthGuard('steam'))
  @Get('/return')
  authSteamReturn() {}
}
