import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: {
    createOrder: jest.Mock;
  };

  const order = {
    email: 'test@example.com',
    phone: '+79999999999',
    tickets: [
      {
        film: 'film-1',
        session: 'session-1',
        daytime: '2026-11-03T18:00:00',
        row: 1,
        seat: 2,
        price: 300,
      },
    ],
  };

  beforeEach(async () => {
    orderService = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderService }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should create an order', async () => {
    const result = {
      total: 1,
      items: [{ ...order.tickets[0], id: 'ticket-1' }],
    };

    orderService.createOrder.mockResolvedValue(result);

    expect(await controller.createOrder(order)).toEqual(result);
    expect(orderService.createOrder).toHaveBeenCalledWith(order);
  });

  it('should throw error if order is invalid', async () => {
    orderService.createOrder.mockRejectedValue(
      new BadRequestException('No tickets provided'),
    );

    await expect(
      controller.createOrder({ ...order, tickets: [] }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if session is not found', async () => {
    orderService.createOrder.mockRejectedValue(
      new NotFoundException('Session not found'),
    );

    await expect(controller.createOrder(order)).rejects.toThrow(
      NotFoundException,
    );
  });
});
