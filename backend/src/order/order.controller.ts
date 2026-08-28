import { Controller, Post, Body } from '@nestjs/common';

@Controller('api/afisha/order')
export class OrderController {
  @Post()
  async createOrder(@Body() body: any) {
    return { total: 0, items: [], body };
  }
}
