import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

export enum AuthSource {
  STEAM = 'steam',
}

@Entity()
export class UserAuthSource {
  @PrimaryColumn({ type: 'int' })
  @ManyToOne(() => User, (user) => user.userAuthSources)
  user: User;

  @PrimaryColumn()
  @Column({ type: 'varchar' })
  authSource: AuthSource;

  @Column()
  authSourceUserId: string;

  @Column({ type: 'json' })
  authSourceProfileData: object;
}
