import { Controller, Post, Body } from '@nestjs/common';
import { ScoreSubmissionService } from './score-submission.service';
import { CreateScoreSubmissionDto } from './dto/create-score-submission.dto';

@Controller('score-submission')
export class ScoreSubmissionController {
  constructor(private readonly scoreSubmissionService: ScoreSubmissionService) {}

  @Post()
  create(@Body() createScoreSubmissionDto: CreateScoreSubmissionDto) {
    return this.scoreSubmissionService.create(createScoreSubmissionDto);
  }
}
