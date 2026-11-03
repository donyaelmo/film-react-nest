import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: {
    findAll: jest.Mock;
    findSchedule: jest.Mock;
  };

  beforeEach(async () => {
    filmsService = {
      findAll: jest.fn(),
      findSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsService }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should return all films', async () => {
    const films = { total: 0, items: [] };
    filmsService.findAll.mockResolvedValue(films);

    const result = await controller.getFilms();

    expect(result).toEqual(films);
    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return film schedule', async () => {
    const schedule = { total: 0, items: [] };
    filmsService.findSchedule.mockResolvedValue(schedule);

    const result = await controller.getFilmSchedule('film-1');

    expect(result).toEqual(schedule);
    expect(filmsService.findSchedule).toHaveBeenCalledWith('film-1');
  });

  it('should throw error if film is not found', async () => {
    filmsService.findSchedule.mockRejectedValue(
      new NotFoundException('Film not found'),
    );

    await expect(controller.getFilmSchedule('wrong-id')).rejects.toThrow(
      NotFoundException,
    );
    expect(filmsService.findSchedule).toHaveBeenCalledWith('wrong-id');
  });
});
