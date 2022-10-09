import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
  ) {}

  async create(data: CreateOrderItemDto) {
    const order = await this.orderRepo.findOneBy({ id: data.orderId });
    const product = await this.productRepo.findOneBy({ id: data.productId });
    const newOrderItem = new OrderItem();
    newOrderItem.order = order;
    newOrderItem.product = product;
    newOrderItem.quantity = data.quantity;
    return this.orderItemRepo.save(newOrderItem);
  }
}
