import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Film } from './film.entity';
import { arrayTextTransformer } from './array-text.transformer';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  daytime: string;

  @Column({ type: 'integer' })
  hall: number;

  @Column({ type: 'integer' })
  rows: number;

  @Column({ type: 'integer' })
  seats: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ type: 'text', transformer: arrayTextTransformer })
  taken: string[];

  @ManyToOne(() => Film, { nullable: true })
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
