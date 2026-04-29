import {
  Controller, Get, Post, Body, Param, UseGuards, Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { GetUser } from '../common/get-user.decorator';
import { UserEntity } from '../users/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@GetUser() user: UserEntity, @Body() dto: CreateOrderDto) {
    return this.orderService.createFromCart(user.id, dto);
  }

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.orderService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@GetUser() user: UserEntity, @Param('id') id: string) {
    return this.orderService.findOneForUser(id, user.id);
  }
}