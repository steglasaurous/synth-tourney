import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PlayInstance} from "./play-instance.entity";
import {Score} from "./score.entity";

@Entity()
export class ScoreSubmission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    submitter: string;

    @Column()
    submittedOn: number;

    @ManyToOne(() => PlayInstance, playInstance => playInstance.scoreSubmissions)
    playInstance: PlayInstance;

    @OneToMany(() => Score, score => score.scoreSubmission)
    scores: Score[]
}