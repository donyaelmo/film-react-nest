import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Film, FilmDocument } from './films.schema';
import { Model } from 'mongoose';

@Injectable()
export class FilmsService {
    constructor(
        @InjectModel(Film.name) private filmModel: Model<FilmDocument>
    ) {}

    async findAll() {
        const items = await this.filmModel.find();
        return {
            total: items.length,
            items: items
        }
    }

    async findOne(id: string) {
        const item = await this.filmModel.findOne({id});

        if (!item) {
            throw new NotFoundException(`Film ${id} not found`);
        }
        return item;
    }

    async findSchedule(id: string) {
        const item = await this.findOne(id);
        return {
            total: item.schedule.length,
            items: item.schedule
        }
    }
}
