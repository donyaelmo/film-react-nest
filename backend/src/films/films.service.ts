import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { GetFilmsResponseDto, GetScheduleResponseDto } from './dto/films.dto';
import { FilmDocument } from './films.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<GetFilmsResponseDto> {
    return this.filmsRepository.findAll();
  }

  async findSchedule(id: string): Promise<GetScheduleResponseDto> {
    return this.filmsRepository.findSchedule(id);
  }

  async findById(id: string): Promise<FilmDocument> {
    return this.filmsRepository.findById(id);
  }

  async save(film: FilmDocument): Promise<FilmDocument> {
    return this.filmsRepository.save(film);
  }
}
