import { IsString, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from './order.entity.js';

export class CreateOrderDto {
  @IsString()
  shippingAddress: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}