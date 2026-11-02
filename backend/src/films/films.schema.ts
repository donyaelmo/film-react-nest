import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Schedule {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  daytime: string;

  @Prop({ required: true })
  hall: number;

  @Prop({ required: true })
  rows: number;

  @Prop({ required: true })
  seats: number;

  @Prop({ required: true })
  price: number;

  @Prop([String])
  taken: string[];
}

export type ScheduleDocument = HydratedDocument<Schedule>;
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema()
export class Film {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop([String])
  tags: string[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop([ScheduleSchema])
  schedule: Schedule[];
}

export type FilmDocument = HydratedDocument<Film>;
export const FilmSchema = SchemaFactory.createForClass(Film);
