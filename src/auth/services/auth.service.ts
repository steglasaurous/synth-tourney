import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  private jwtService: JwtService;

  constructor() {}

  getJwt(user: User) {}
}
