import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmRecord, ScheduleRecord } from './film.types';

@Injectable()
export class FilmsRepository {
  private readonly snapshots = new WeakMap<FilmRecord, Map<string, string[]>>();

  constructor(
    @InjectRepository(Film)
    private readonly films: Repository<Film>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.films.find();

    const items = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseTags(film.tags),
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));

    return { total: items.length, items };
  }

  async findById(id: string): Promise<FilmRecord> {
    const film = await this.films.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!film) {
      throw new NotFoundException(`Film ${id} not found`);
    }

    const schedule: ScheduleRecord[] = film.schedule.map((session) => ({
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: this.parseTaken(session.taken),
    }));

    const result: FilmRecord = {
      ...film,
      tags: this.parseTags(film.tags),
      schedule,
    };

    const snapshot = new Map<string, string[]>();

    for (const session of schedule) {
      snapshot.set(session.id, [...session.taken]);
    }

    this.snapshots.set(result, snapshot);

    return result;
  }

  async findSchedule(
    id: string,
  ): Promise<{ total: number; items: ScheduleDto[] }> {
    const film = await this.findById(id);

    const items = film.schedule.map((session) => ({
      ...session,
      hall: String(session.hall),
    }));

    return { total: items.length, items };
  }

  async save(film: FilmRecord): Promise<FilmRecord> {
    const snapshot = this.snapshots.get(film);

    if (!snapshot) {
      throw new Error('Film was not loaded through the repository');
    }

    await this.dataSource.transaction(async (manager) => {
      for (const session of film.schedule) {
        const previous = snapshot.get(session.id);

        if (!previous) {
          continue;
        }

        const added = session.taken.filter((seat) => !previous.includes(seat));

        if (added.length === 0) {
          continue;
        }

        const currentSession = await manager.findOne(Schedule, {
          where: { id: session.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!currentSession) {
          throw new NotFoundException(`Session ${session.id} not found`);
        }

        const current = this.parseTaken(currentSession.taken);

        for (const seat of added) {
          if (current.includes(seat)) {
            throw new BadRequestException(`Seat ${seat} is already taken`);
          }
        }

        currentSession.taken = JSON.stringify([...current, ...added]);

        await manager.save(currentSession);
      }
    });

    for (const session of film.schedule) {
      snapshot.set(session.id, [...session.taken]);
    }

    return film;
  }

  private parseTags(value: string): string[] {
    return value
      ? value
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];
  }

  private parseTaken(value: string): string[] {
    return value ? (JSON.parse(value) as string[]) : [];
  }
}
