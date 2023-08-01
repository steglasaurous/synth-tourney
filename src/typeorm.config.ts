import { DataSource } from 'typeorm';
import { PlayInstance } from './score-submission/entities/play-instance.entity';
import { Score } from './score-submission/entities/score.entity';
import { ScoreSubmission } from './score-submission/entities/score-submission.entity';
import { SynthMap } from './score-submission/entities/synth-map.entity';
import { Migrations1690742229837 } from '../migrations/1690742229837-migrations';
import { Migrations1690743467373 } from '../migrations/1690743467373-migrations';
import { Migration1690746005081 } from '../migrations/1690746005081-migrations';
import { Migration1690919848890 } from '../migrations/1690919848890-migrations';

export default new DataSource({
  type: 'sqlite',
  database: 'synth-tourney.db',
  entities: [PlayInstance, Score, ScoreSubmission, SynthMap],
  migrations: [
    Migrations1690742229837,
    Migrations1690743467373,
    Migration1690746005081,
    Migration1690919848890,
  ],
});
