 import {
  Controller, Get, Post, Patch, Delete,Body, Param, UseGuards, } from '@nestjs/common';
import {AddToCartDto, UpdateCartItemDto } from '../cart/cart.dto.js';
import { CartService } from '../cart/cart.service.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { GetUser } from '../common/get-user.decorator.js';
import { UserEntity } from '../users/user.entity.js';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@GetUser() user: UserEntity) {
    return this.cartService.getCartTotal(user.id);
  }

  @Post()
  addItem(@GetUser() user: UserEntity, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(user.id, dto);
  }

  @Patch(':itemId')
  updateItem(
    @GetUser() user: UserEntity,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.id, itemId, dto);
  }

  @Delete(':itemId')
  removeItem(@GetUser() user: UserEntity, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(user.id, itemId);
  }
}