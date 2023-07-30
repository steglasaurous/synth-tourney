import { Module } from '@nestjs/common';
import { ScoreSubmissionService } from './score-submission.service';
import { ScoreSubmissionController } from './score-submission.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SynthMap} from "./entities/synth-map.entity";
import {PlayInstance} from "./entities/play-instance.entity";
import {ScoreSubmission} from "./entities/score-submission.entity";
import {Score} from "./entities/score.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SynthMap, PlayInstance, ScoreSubmission, Score])],
  controllers: [ScoreSubmissionController],
  providers: [ScoreSubmissionService]
})
export class ScoreSubmissionModule {}
