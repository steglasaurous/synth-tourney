import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoreSubmissionModule } from './score-submission/score-submission.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StartModule } from './start/start.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
    AppModule,
    StartModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
