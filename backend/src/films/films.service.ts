import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import {
  SessionNotFoundError,
  SeatAlreadyTakenError,
} from '../repository/repository.errors';
import { GetFilmsResponseDto, GetScheduleResponseDto } from './dto/films.dto';
import { FilmDocument } from './films.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<GetFilmsResponseDto> {
    return this.filmsRepository.findAll();
  }

  async findSchedule(id: string): Promise<GetScheduleResponseDto> {
    const schedule = await this.filmsRepository.findSchedule(id);

    if (!schedule) {
      throw new NotFoundException(`Film ${id} not found`);
    }

    return schedule;
  }

  async findById(id: string): Promise<FilmDocument> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException(`Film ${id} not found`);
    }

    return film;
  }

  async save(film: FilmDocument): Promise<FilmDocument> {
    try {
      return await this.filmsRepository.save(film);
    } catch (error) {
      if (error instanceof SessionNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof SeatAlreadyTakenError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
