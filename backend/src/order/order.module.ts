import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/films.schema';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Film.name, schema: FilmSchema}
      ]
    ), FilmsModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
