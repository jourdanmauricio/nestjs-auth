// src\users\controllers\order-item.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItemService } from '../services/orderItem.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  @Post('')
  create(@Body() payload: CreateOrderItemDto) {
    return this.orderItemService.create(payload);
  }
}
