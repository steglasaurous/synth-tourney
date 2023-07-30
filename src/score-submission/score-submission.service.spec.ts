import { Test, TestingModule } from '@nestjs/testing';
import { ScoreSubmissionService } from './score-submission.service';

describe('ScoreSubmissionService', () => {
  let service: ScoreSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoreSubmissionService],
    }).compile();

    service = module.get<ScoreSubmissionService>(ScoreSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
