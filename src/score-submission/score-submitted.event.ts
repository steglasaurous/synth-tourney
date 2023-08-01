import { Score } from './entities/score.entity';
export class ScoreSubmittedEvent {
  constructor(public scores: Score[]) {}
}
