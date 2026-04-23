import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from '../admin/admin.service.js';
import { AdminController } from '../admin/admin.controller.js';
import { OrderEntity } from '../orders/order.entity.js';
import { OrderItem } from '../orders/order-item.entity.js';
import { UserEntity } from '../users/user.entity.js';
import { ProductEntity } from '../products/product.entity.js';
import { OrderModule } from '../orders/order.module.js';
import {UserModule } from "../users/user.module.js";
import { ProductModule } from '../products/product.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItem, UserEntity, ProductEntity]),
    OrderModule,
    UserModule,
    ProductModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}