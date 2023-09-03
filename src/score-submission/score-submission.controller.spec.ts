import { Test, TestingModule } from '@nestjs/testing';
import { ScoreSubmissionController } from './score-submission.controller';
import { getGenericNestMock } from '../../test/test-helper';

describe('ScoreSubmissionController', () => {
  let controller: ScoreSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreSubmissionController],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    controller = module.get<ScoreSubmissionController>(
      ScoreSubmissionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
