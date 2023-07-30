import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ScoreSubmission} from "./score-submission.entity";

@Entity()
export class Score {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ScoreSubmission, scoreSubmission => scoreSubmission.scores)
    scoreSubmission: ScoreSubmission;

    @Column()
    playerName: string;

    @Column()
    score: number;

    @Column()
    perfectHits: number;

    @Column()
    goodHits: number;

    @Column()
    poorHits: number;

    @Column()
    longestStreak: number;

    @Column()
    maxMultiplier: number;

    @Column()
    specialsHit: number;
}
