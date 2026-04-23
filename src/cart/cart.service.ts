import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../cart/cart.entity.js';
import { CartItem } from '../cart/cart-item.entity.js';
import { ProductService } from '../products/product.service.js';
import { AddToCartDto, UpdateCartItemDto } from '../cart/cart.dto.js';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity) private cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    private productService: ProductService,
  ) {}

  async getOrCreateCart(userId: string): Promise<CartEntity> {
    let cart = await this.cartRepo.findOne({ where: { userId } });
    if (!cart){
        cart = await this.cartRepo.create({userId}) 
      await this.cartRepo.save(cart);    
    }
    const fullCart = await this.cartRepo.findOne({
    where: { userId },
      relations: ['items', 'items.product'] });
      
    if (!fullCart) {
    throw new Error('Cart not found after creation'); // safety guard
  }

  return fullCart; 
   
    }
      

  async addItem(userId: string, dto: AddToCartDto): Promise<CartEntity> {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productService.checkStock(dto.productId, dto.quantity);

    const existingItem = cart.items?.find((i) => i.productId === dto.productId);

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      const item = this.cartItemRepo.create({
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
        priceAtTime: product.price,
      });
      await this.cartItemRepo.save(item);
    }

    return this.getOrCreateCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<CartEntity> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    await this.productService.checkStock(item.productId, dto.quantity);
    await this.cartItemRepo.update(itemId, { quantity: dto.quantity });
    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<CartEntity> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items?.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    await this.cartItemRepo.delete(itemId);
    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepo.delete({ cartId: cart.id });
  }

  async getCartTotal(userId: string): Promise<{ cart: CartEntity; total: number }> {
    const cart = await this.getOrCreateCart(userId);
    const total = cart.items?.reduce((sum, item) => sum + Number(item.priceAtTime) * item.quantity, 0) || 0;
    return { cart, total };
  }
}