import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get()
  async getFilms() {
    return this.filmsService.findAll();
  }

  @Get(':id')
  async getFilm(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    return this.filmsService.findSchedule(id);
  }
}
