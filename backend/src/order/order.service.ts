import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/films.schema';
import { FilmsService } from '../films/films.service';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Film.name) private filmModel: Model<FilmDocument>,
        private readonly filmsService: FilmsService,
    ) {}

    async createOrder(orderData) {
        const tickets = Array.isArray(orderData) ? orderData : orderData.tickets || orderData.items || [orderData];
        const resultTickets = [];

        for (const ticket of tickets) {
            const film = await this.filmsService.findOne(ticket.film);

            const session = film.schedule.find((s) => s.id === ticket.session);
            if (!session) {
                throw new NotFoundException(`Session ${ticket.session} not found for film ${ticket.film}`);
            }

            const seatKey = `${ticket.row}:${ticket.seat}`;
            if (session.taken.includes(seatKey)) {
                throw new BadRequestException(`Seat ${seatKey} is already taken`);
            }

            session.taken.push(seatKey);
            await film.save();

            resultTickets.push({
                ...ticket,
                id: crypto.randomUUID()
            })
        }

        return {
            total: resultTickets.length,
            items: resultTickets
        }
    }
}
