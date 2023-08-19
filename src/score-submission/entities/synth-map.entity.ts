import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlayInstance } from './play-instance.entity';

@Entity()
export class SynthMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  mapper: string;

  @Column()
  difficulty: string;

  @Column()
  totalNotes: number;

  @Column()
  totalSpecials: number;

  @Column({ unique: true })
  hash: string;

  @OneToMany(() => PlayInstance, (playInstance) => playInstance.synthMap)
  playInstances: PlayInstance[];
}
