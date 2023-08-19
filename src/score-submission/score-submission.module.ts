import { Module } from '@nestjs/common';
import { ScoreSubmissionService } from './score-submission.service';
import { ScoreSubmissionController } from './score-submission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SynthMap } from './entities/synth-map.entity';
import { PlayInstance } from './entities/play-instance.entity';
import { ScoreSubmission } from './entities/score-submission.entity';
import { Score } from './entities/score.entity';
import { GoogleSheetUpdaterListener } from './listeners/google-sheet-updater.listener';
import { GoogleSheetRhythmMastersListener } from './listeners/google-sheet-rhythm-masters.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([SynthMap, PlayInstance, ScoreSubmission, Score]),
  ],
  controllers: [ScoreSubmissionController],
  providers: [
    ScoreSubmissionService,
    // GoogleSheetUpdaterListener,
    GoogleSheetRhythmMastersListener,
  ],
})
export class ScoreSubmissionModule {}
