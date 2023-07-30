import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {SynthMap} from "./synth-map.entity";
import {ScoreSubmission} from "./score-submission.entity";

@Entity()
export class PlayInstance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SynthMap, synthMap => synthMap.playInstances)
    synthMap: SynthMap;

    @Column()
    timestamp: number;

    @Column({ nullable: true })
    roomId: string;

    @OneToMany(() => ScoreSubmission, scoreSubmission => scoreSubmission.playInstance)
    scoreSubmissions: ScoreSubmission[];
}
