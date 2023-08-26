import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  AuthSource,
  UserAuthSource,
} from '../entities/user-auth-source.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAuthSource)
    private userAuthSource: Repository<UserAuthSource>,
    private em: EntityManager,
  ) {}

  async loginUser(
    authSource: AuthSource,
    authSourceUserId: string,
    authSourceUsername: string,
    profileData: any,
  ): Promise<User> {
    const existingUserAuthSource = await this.userAuthSource.findOne({
      where: { authSource: authSource, authSourceUserId: authSourceUserId },
    });
    if (existingUserAuthSource) {
      if (existingUserAuthSource.authSourceProfileData != profileData) {
        existingUserAuthSource.authSourceProfileData = profileData;
        await this.em.save(existingUserAuthSource);
      }
      return existingUserAuthSource.user;
    }

    // If I have a new sign-in, but have no way of associating users, then create a new one.
    // FIXME: Do we get email addresses? Can I associate based on that?
    const newUser = new User();
    newUser.username = authSourceUsername;
    newUser.displayName = authSourceUsername;
    const savedUser = await this.em.save(newUser);

    const newUserAuthSource = new UserAuthSource();
    newUserAuthSource.user = savedUser;
    newUserAuthSource.authSource = authSource;
    newUserAuthSource.authSourceUserId = authSourceUserId;
    newUserAuthSource.authSourceProfileData = profileData;
    await this.em.save(newUserAuthSource);

    return newUser;
  }

  getUser(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
