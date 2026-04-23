import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../cart/cart.entity.js';
import { CartItem } from '../cart/cart-item.entity.js';
import { CartService } from '../cart/cart.service.js';
import { CartController } from '../cart/cart.controller.js';
import { ProductModule } from '../products/product.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItem]), ProductModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}