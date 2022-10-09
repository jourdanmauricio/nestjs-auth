import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductsService } from './../../products/services/products.service';
import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  async findAll() {
    return await this.userRepo.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    if (data.customerId) {
      const customer = await this.customersService.findOne(data.customerId);
      newUser.customer = customer;
    }
    return await this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    const updateUser = this.userRepo.merge(user, changes);
    return this.userRepo.save(updateUser);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  async getOrderByUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }
}
