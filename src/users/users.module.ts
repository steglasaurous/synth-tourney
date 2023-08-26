import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAuthSource } from './entities/user-auth-source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAuthSource])],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UsersModule {}
