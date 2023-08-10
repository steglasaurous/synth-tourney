import { Score } from './entities/score.entity';
import { ScoreSubmission } from './entities/score-submission.entity';
import { SynthMap } from './entities/synth-map.entity';
import { PlayInstance } from './entities/play-instance.entity';
export class ScoreSubmittedEvent {
  constructor(
    public synthMap: SynthMap,
    public playInstance: PlayInstance,
    public scoreSubmission: ScoreSubmission,
    public scores: Score[],
  ) {}
}
