import { DataSource } from 'typeorm';
import { PlayInstance } from './score-submission/entities/play-instance.entity';
import { Score } from './score-submission/entities/score.entity';
import { ScoreSubmission } from './score-submission/entities/score-submission.entity';
import { SynthMap } from './score-submission/entities/synth-map.entity';
import { User } from './users/entities/user.entity';
import { UserAuthSource } from './users/entities/user-auth-source.entity';
import { Migrations1693065230348 } from '../migrations/1693065230348-migrations';

export default new DataSource({
  type: 'sqlite',
  database: 'synth-tourney.db',
  entities: [
    PlayInstance,
    Score,
    ScoreSubmission,
    SynthMap,
    User,
    UserAuthSource,
  ],
  migrations: [Migrations1693065230348],
});
