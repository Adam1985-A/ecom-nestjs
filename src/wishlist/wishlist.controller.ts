import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WishlistService, AddWishlistDto } from '../wishlist/wishlist.service.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { GetUser } from '../common/get-user.decorator.js';
import { UserEntity } from '../users/user.entity.js';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.wishlistService.findAll(user.id);
  }

  @Post()
  add(@GetUser() user: UserEntity, @Body() dto: AddWishlistDto) {
    return this.wishlistService.add(user.id, dto);
  }

  @Delete(':productId')
  remove(@GetUser() user: UserEntity, @Param('productId') productId: string) {
    return this.wishlistService.remove(user.id, productId);
  }
}