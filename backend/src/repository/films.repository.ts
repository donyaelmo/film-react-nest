import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { Film, FilmDocument, Schedule } from '../films/films.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const items = await this.filmModel
      .find()
      .select('-schedule -_id -__v')
      .lean();

    return {
      total: items.length,
      items: items as FilmDto[],
    };
  }

  async findById(id: string): Promise<FilmDocument> {
    const item = await this.filmModel.findOne({ id });
    if (!item) {
      throw new NotFoundException(`Film ${id} not found`);
    }
    return item;
  }

  async findSchedule(
    id: string,
  ): Promise<{ total: number; items: ScheduleDto[] }> {
    const item = await this.findById(id);
    const items = this.mapSchedule(item.schedule);

    return {
      total: items.length,
      items,
    };
  }

  async save(film: FilmDocument): Promise<FilmDocument> {
    return film.save();
  }

  private mapSchedule(schedule: Schedule[]): ScheduleDto[] {
    return schedule.map(({ id, daytime, hall, rows, seats, price, taken }) => ({
      id,
      daytime,
      hall: String(hall),
      rows,
      seats,
      price,
      taken: taken ?? [],
    }));
  }
}
