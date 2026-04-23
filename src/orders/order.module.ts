import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../orders/order.entity.js';
import { OrderItem } from '../orders/order-item.entity.js';
import { OrderService } from '../orders/order.service.js';
import { OrderController } from '../orders/order.controller.js';
import { CartModule } from '../cart/cart.module.js';
import { ProductModule } from '../products/product.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItem]),
    CartModule,
    ProductModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}