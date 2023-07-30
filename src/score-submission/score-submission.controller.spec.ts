import { Test, TestingModule } from '@nestjs/testing';
import { ScoreSubmissionController } from './score-submission.controller';
import { ScoreSubmissionService } from './score-submission.service';

describe('ScoreSubmissionController', () => {
  let controller: ScoreSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreSubmissionController],
      providers: [ScoreSubmissionService],
    }).compile();

    controller = module.get<ScoreSubmissionController>(ScoreSubmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
