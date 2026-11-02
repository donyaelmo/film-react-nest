import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmsRepository } from './films.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  providers: [FilmsRepository],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
