import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoreSubmissionModule } from './score-submission/score-submission.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ScoreSubmissionModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'synth-tourney.db',
      autoLoadEntities: true,
      migrations: [],
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
