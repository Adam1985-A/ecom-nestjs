 import {
  Controller, Get, Post, Patch, Delete,Body, Param, UseGuards, } from '@nestjs/common';
import {AddToCartDto, UpdateCartItemDto } from './cart.dto';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { GetUser } from '../common/get-user.decorator';
import { UserEntity } from '../users/user.entity';

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