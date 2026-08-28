import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Film, FilmSchema } from './films.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Film.name, schema: FilmSchema}
    ]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService]
})
export class FilmsModule {}
