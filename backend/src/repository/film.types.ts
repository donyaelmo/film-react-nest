import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

export type ScheduleRecord = Omit<Schedule, 'film' | 'taken'> & {
  taken: string[];
};

export type FilmRecord = Omit<Film, 'tags' | 'schedule'> & {
  tags: string[];
  schedule: ScheduleRecord[];
};
