import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, GetOrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() body: CreateOrderDto,
  ): Promise<GetOrderResponseDto> {
    return this.orderService.createOrder(body);
  }
}
