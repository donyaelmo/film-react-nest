import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/films.schema';
import { FilmsRepository } from './films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [FilmsRepository],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
