import { Test, TestingModule } from '@nestjs/testing';
import { ScoreSubmissionService } from './score-submission.service';
import { getGenericNestMock } from '../../test/test-helper';
import { Repository } from 'typeorm';
import { SynthMap } from './entities/synth-map.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayInstance } from './entities/play-instance.entity';
import { ScoreSubmission } from './entities/score-submission.entity';
import { Score } from './entities/score.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateScoreSubmissionDto } from './dto/create-score-submission.dto';
import { ScoreSubmittedEvent } from './score-submitted.event';

describe('ScoreSubmissionService', () => {
  let service: ScoreSubmissionService;
  let synthMapRespository;
  let playInstanceRepository;
  let scoreSubmissionRepository;
  let scoreRepository;
  let eventEmitter;
  const createScoreSubmissionDto = new CreateScoreSubmissionDto();
  createScoreSubmissionDto.roomName = 'testroom';
  createScoreSubmissionDto.submitterName = 'testsubmitter';
  createScoreSubmissionDto.map = {
    title: 'testTitle',
    artist: 'testArtist',
    difficulty: 'expert',
    mapper: 'someMapper',
    totalNotes: 12,
    totalSpecials: 2,
  };
  createScoreSubmissionDto.scores = [
    {
      playerName: 'player1',
      perfectHits: 6,
      goodHits: 4,
      poorHits: 2,
      longestStreak: 12,
      maxMultiplier: 4,
      score: 10000,
      specialsHit: 2,
    },
    {
      playerName: 'player2',
      perfectHits: 4,
      goodHits: 4,
      poorHits: 2,
      longestStreak: 10,
      maxMultiplier: 2,
      score: 9000,
      specialsHit: 2,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreSubmissionService,
        {
          provide: getRepositoryToken(SynthMap),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PlayInstance),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ScoreSubmission),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Score),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<ScoreSubmissionService>(ScoreSubmissionService);
    synthMapRespository = module.get<Repository<SynthMap>>(
      getRepositoryToken(SynthMap),
    );
    playInstanceRepository = module.get<Repository<PlayInstance>>(
      getRepositoryToken(PlayInstance),
    );
    scoreSubmissionRepository = module.get<Repository<ScoreSubmission>>(
      getRepositoryToken(ScoreSubmission),
    );
    scoreRepository = module.get<Repository<Score>>(getRepositoryToken(Score));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  const verifyResult = (done) => {
    expect(scoreSubmissionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        playInstance: expect.objectContaining({
          roomName: createScoreSubmissionDto.roomName,
        }),
        submittedOn: expect.anything(),
        submitter: createScoreSubmissionDto.submitterName,
      }),
    );

    for (let i = 0; i < createScoreSubmissionDto.scores.length; i++) {
      expect(scoreRepository.save).toHaveBeenNthCalledWith(
        i + 1,
        expect.objectContaining({
          scoreSubmission: expect.objectContaining({
            submitter: createScoreSubmissionDto.submitterName,
          }),
          score: createScoreSubmissionDto.scores[i].score,
          maxMultiplier: createScoreSubmissionDto.scores[i].maxMultiplier,
          longestStreak: createScoreSubmissionDto.scores[i].longestStreak,
          goodHits: createScoreSubmissionDto.scores[i].goodHits,
          perfectHits: createScoreSubmissionDto.scores[i].perfectHits,
          poorHits: createScoreSubmissionDto.scores[i].poorHits,
          specialsHit: createScoreSubmissionDto.scores[i].specialsHit,
          playerName: createScoreSubmissionDto.scores[i].playerName,
        }),
      );
    }

    expect(eventEmitter.emitAsync.mock.calls[0][0]).toEqual(
      ScoreSubmittedEvent.name,
    );
    expect(eventEmitter.emitAsync.mock.calls[0][1]).toBeInstanceOf(
      ScoreSubmittedEvent,
    );
    // Should test that contents match what we expect?

    done();
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new synthmap, playinstance, score submission and scores', (done) => {
    synthMapRespository.findOneBy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });
    synthMapRespository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    playInstanceRepository.findOneBy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });
    playInstanceRepository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    scoreSubmissionRepository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    scoreRepository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    eventEmitter.emitAsync.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });
    service.create(createScoreSubmissionDto).then(() => {
      expect(synthMapRespository.findOneBy).toHaveBeenCalled();
      expect(synthMapRespository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          hash: expect.anything(),
          artist: createScoreSubmissionDto.map.artist,
          difficulty: createScoreSubmissionDto.map.difficulty,
          mapper: createScoreSubmissionDto.map.mapper,
          title: createScoreSubmissionDto.map.title,
          totalNotes: createScoreSubmissionDto.map.totalNotes,
          totalSpecials: createScoreSubmissionDto.map.totalSpecials,
        }),
      );

      expect(playInstanceRepository.findOneBy).toHaveBeenCalled();
      expect(playInstanceRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          roomName: createScoreSubmissionDto.roomName,
          synthMap: expect.objectContaining({
            title: createScoreSubmissionDto.map.title,
          }),
          timestamp: expect.anything(),
        }),
      );

      verifyResult(done);
    });
  });

  it('should use an existing synthmap', (done) => {
    synthMapRespository.findOneBy.mockImplementation(() => {
      return new Promise((resolve) => {
        const synthMap = new SynthMap();
        synthMap.hash = 'abcdef';
        synthMap.artist = createScoreSubmissionDto.map.artist;
        synthMap.difficulty = createScoreSubmissionDto.map.difficulty;
        synthMap.mapper = createScoreSubmissionDto.map.mapper;
        synthMap.title = createScoreSubmissionDto.map.title;
        synthMap.totalNotes = createScoreSubmissionDto.map.totalNotes;
        synthMap.totalSpecials = createScoreSubmissionDto.map.totalSpecials;

        resolve(synthMap);
      });
    });

    playInstanceRepository.findOneBy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });
    playInstanceRepository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    scoreSubmissionRepository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    scoreRepository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    eventEmitter.emitAsync.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });
    service.create(createScoreSubmissionDto).then(() => {
      expect(synthMapRespository.findOneBy).toHaveBeenCalled();
      expect(synthMapRespository.save).not.toHaveBeenCalled();
      expect(playInstanceRepository.findOneBy).toHaveBeenCalled();
      expect(playInstanceRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          roomName: createScoreSubmissionDto.roomName,
          synthMap: expect.objectContaining({
            title: createScoreSubmissionDto.map.title,
          }),
          timestamp: expect.anything(),
        }),
      );

      verifyResult(done);
    });
  });

  it('should use an existing playinstance', (done) => {
    const synthMap = new SynthMap();
    synthMap.hash = 'abcdef';
    synthMap.artist = createScoreSubmissionDto.map.artist;
    synthMap.difficulty = createScoreSubmissionDto.map.difficulty;
    synthMap.mapper = createScoreSubmissionDto.map.mapper;
    synthMap.title = createScoreSubmissionDto.map.title;
    synthMap.totalNotes = createScoreSubmissionDto.map.totalNotes;
    synthMap.totalSpecials = createScoreSubmissionDto.map.totalSpecials;

    synthMapRespository.findOneBy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(synthMap);
      });
    });

    playInstanceRepository.findOneBy.mockImplementation(() => {
      return new Promise((resolve) => {
        const playInstance = new PlayInstance();
        playInstance.id = 1;
        playInstance.synthMap = synthMap;
        playInstance.roomName = createScoreSubmissionDto.roomName;
        playInstance.timestamp = Date.now();
        playInstance.scoreSubmissions = [];

        resolve(playInstance);
      });
    });

    scoreSubmissionRepository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    scoreRepository.save.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    eventEmitter.emitAsync.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });
    service.create(createScoreSubmissionDto).then(() => {
      expect(synthMapRespository.findOneBy).toHaveBeenCalled();
      expect(synthMapRespository.save).not.toHaveBeenCalled();
      expect(playInstanceRepository.findOneBy).toHaveBeenCalled();
      expect(playInstanceRepository.save).not.toHaveBeenCalled();

      verifyResult(done);
    });
  });
});
