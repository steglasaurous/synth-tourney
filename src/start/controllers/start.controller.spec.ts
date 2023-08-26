import { Test, TestingModule } from '@nestjs/testing';
import { StartController } from './start.controller';

describe('StartController', () => {
  let controller: StartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartController],
    }).compile();

    controller = module.get<StartController>(StartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
