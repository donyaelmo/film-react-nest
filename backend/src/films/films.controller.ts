import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsResponseDto, GetScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<GetFilmsResponseDto> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<GetScheduleResponseDto> {
    return this.filmsService.findSchedule(id);
  }
}
