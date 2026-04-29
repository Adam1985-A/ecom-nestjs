import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { OrderEntity } from "../orders/order.entity";
import { OrderItem } from "../orders/order-item.entity";
import { UserEntity } from '../users/user.entity';
import { ProductEntity } from "../products/product.entity";
import { OrderModule } from "../orders/order.module";
import {UserModule } from "../users/user.module";
import { ProductModule } from "../products/product.module";

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