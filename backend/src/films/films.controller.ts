import { Controller, Get, Param } from '@nestjs/common';

@Controller('api/afisha/films')
export class FilmsController {
  @Get()
  async getFilms() {
    return { total: 0, items: [] };
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    return { total: 0, items: [], id };
  }
}
