import { Test, TestingModule } from '@nestjs/testing';
import { SteamAuthController } from './steam-auth.controller';

describe('SteamAuthController', () => {
  let controller: SteamAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SteamAuthController],
    }).compile();

    controller = module.get<SteamAuthController>(SteamAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
