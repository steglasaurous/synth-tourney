import { PlayInstance } from './entities/play-instance.entity';
import { ScoreSubmission } from './entities/score-submission.entity';
import { Score } from './entities/score.entity';
export class ScoreSubmittedEvent {
  playInstance: PlayInstance;
  scoreSubmission: ScoreSubmission;
  scores: Score[];
}
