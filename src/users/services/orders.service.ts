// src\users\services\orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Customer } from '../entities/customer.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: {
          product: true,
        },
      }, // Agregamos relacion
    });
    if (!order) {
      throw new NotFoundException(`order ${id} not found`);
    }
    return order;
  }

  async ordersByCustomer(userId: number) {
    // return this.orderRepo.find({
    //   where: {
    //     customer: customerId,
    //   },
    // });
    const customerId = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['customer'],
    });
    //.customer.id;
    return this.orderRepo.find({
      where: {
        customer: customerId,
      },
      relations: ['items', 'items.product'],
    });
  }

  async create(data: CreateOrderDto) {
    const order = new Order();
    if (data.customerId) {
      const customer = await this.customerRepo.findOneBy({
        id: data.customerId,
      });
      order.customer = customer;
    }
    return this.orderRepo.save(order);
  }

  async update(id: number, changes: UpdateOrderDto) {
    const order = await this.orderRepo.findOneBy({ id });
    if (changes.customerId) {
      const customer = await this.customerRepo.findOneBy({
        id: changes.customerId,
      });
      order.customer = customer;
    }
    return this.orderRepo.save(order);
  }

  delete(id: number) {
    return this.orderRepo.delete(id);
  }
}
