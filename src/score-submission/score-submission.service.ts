import { Injectable } from '@nestjs/common';
import { CreateScoreSubmissionDto} from './dto/create-score-submission.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {SynthMap} from "./entities/synth-map.entity";
import {Repository} from "typeorm";
import {PlayInstance} from "./entities/play-instance.entity";
import {ScoreSubmission} from "./entities/score-submission.entity";
import {Score} from "./entities/score.entity";
import * as crypto from 'node:crypto';

@Injectable()
export class ScoreSubmissionService {
  constructor(
      @InjectRepository(SynthMap) private synthMapRepository: Repository<SynthMap>,
      @InjectRepository(PlayInstance) private playInstanceRepository: Repository<PlayInstance>,
      @InjectRepository(ScoreSubmission) private scoreSubmissionRepository: Repository<ScoreSubmission>,
      @InjectRepository(Score) private scoreRepository: Repository<Score>
  ) {
  }
  async create(createScoreSubmissionDto: CreateScoreSubmissionDto): Promise<void> {
    // See if we have a matching map entry or not.  If not, add it.
    // Generate a hash on the input and search for that?

    const mapHash = crypto.createHash('sha256').update(JSON.stringify(createScoreSubmissionDto.map)).digest('hex');
    let synthMap = await this.synthMapRepository.findOneBy({ hash: mapHash });
    if (!synthMap) {
      synthMap = new SynthMap();
      synthMap.hash = mapHash;
      synthMap.artist = createScoreSubmissionDto.map.artist;
      synthMap.difficulty = createScoreSubmissionDto.map.difficulty;
      synthMap.mapper = createScoreSubmissionDto.map.mapper;
      synthMap.title = createScoreSubmissionDto.map.title;
      synthMap.totalNotes = createScoreSubmissionDto.map.totalNotes;
      synthMap.totalSpecials = createScoreSubmissionDto.map.totalSpecials;

      await this.synthMapRepository.save(synthMap);
    }

    // See if we have a matching play instance.
    // Thinking a hash of all the player names in the room until I figure out
    // how to uniquely identify a MP room.

    const playerNames = createScoreSubmissionDto.scores.map((score) => {
      return score.playerName;
    }).sort((n1, n2) => {
      if (n1 > n2) {
        return 1;
      }
      if (n1 < n1) {
        return -1;
      }

      return 0;
    });

    const roomIdHash = crypto.createHash('sha256').update(playerNames.join('')).digest('hex');
    let playInstance = await this.playInstanceRepository.findOneBy({
      roomId: roomIdHash
    });
    if (!playInstance) {
      playInstance = new PlayInstance();
      playInstance.roomId = roomIdHash;
      playInstance.synthMap = synthMap;
      playInstance.timestamp = Date.now();
      await this.playInstanceRepository.save(playInstance);
    }

    const scoreSubmission = new ScoreSubmission();
    scoreSubmission.playInstance = playInstance;
    scoreSubmission.submittedOn = Date.now();
    scoreSubmission.submitter = createScoreSubmissionDto.submitterName;

    await this.scoreSubmissionRepository.save(scoreSubmission);

    for (let incomingScore of createScoreSubmissionDto.scores.values()) {
      let score = new Score();
      score.scoreSubmission = scoreSubmission;
      score.score = incomingScore.score;
      score.maxMultiplier = incomingScore.maxMultiplier;
      score.longestStreak = incomingScore.longestStreak;
      score.goodHits = incomingScore.goodHits;
      score.perfectHits = incomingScore.perfectHits;
      score.poorHits = incomingScore.poorHits;
      score.specialsHit = incomingScore.specialsHit;
      score.playerName = incomingScore.playerName;

      await this.scoreRepository.save(score);
    }

    // Everything is saved successfully.
    return;
  }
}
