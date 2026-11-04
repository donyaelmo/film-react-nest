import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { FilmsService } from '../films/films.service';
import { FilmDocument } from '../films/films.schema';
import {
  CreateOrderDto,
  GetOrderResponseDto,
  OrderResultDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}

  async createOrder(orderData: CreateOrderDto): Promise<GetOrderResponseDto> {
    const { tickets } = orderData;

    if (!tickets?.length) {
      throw new BadRequestException('No tickets provided');
    }

    const resultTickets: OrderResultDto[] = [];
    const films = new Map<string, FilmDocument>();

    for (const ticket of tickets) {
      let film = films.get(ticket.film);
      if (!film) {
        film = await this.filmsService.findById(ticket.film);
        films.set(ticket.film, film);
      }

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(
          `Session ${ticket.session} not found for film ${ticket.film}`,
        );
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      const taken = session.taken ?? [];

      if (taken.includes(seatKey)) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      session.taken = [...taken, seatKey];

      resultTickets.push({
        ...ticket,
        id: crypto.randomUUID(),
      });
    }

    await this.filmsService.saveAll([...films.values()]);

    return {
      total: resultTickets.length,
      items: resultTickets,
    };
  }
}
