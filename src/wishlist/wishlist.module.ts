import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItem } from '../wishlist/wishlist-item.entity.js';
import { WishlistService } from '../wishlist/wishlist.service.js';
import { WishlistController } from '../wishlist/wishlist.controller.js';
import { ProductModule } from '../products/product.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem]), ProductModule],
  providers: [WishlistService],
  controllers: [WishlistController],
})
export class WishlistModule {}