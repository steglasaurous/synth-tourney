import { Module } from '@nestjs/common';
import { StartController } from './controllers/start.controller';

@Module({
  controllers: [StartController],
})
export class StartModule {}
