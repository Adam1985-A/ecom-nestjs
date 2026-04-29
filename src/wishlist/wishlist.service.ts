import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';
import { ProductService } from '../products/product.service';
import { IsUUID } from 'class-validator';

export class AddWishlistDto {
  @IsUUID()
  productId: string;
}

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem) private wishlistRepo: Repository<WishlistItem>,
    private productsService: ProductService,
  ) {}

  async findAll(userId: string): Promise<WishlistItem[]> {
    return this.wishlistRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async add(userId: string, dto: AddWishlistDto): Promise<WishlistItem> {
    await this.productsService.findOne(dto.productId);
    const exists = await this.wishlistRepo.findOne({ where: { userId, productId: dto.productId } });
    if (exists) throw new ConflictException('Product already in wishlist');
    const item = this.wishlistRepo.create({ userId, productId: dto.productId });
    return this.wishlistRepo.save(item);
  }

  async remove(userId: string, productId: string): Promise<{ message: string }> {
    const item = await this.wishlistRepo.findOne({ where: { userId, productId } });
    if (!item) throw new NotFoundException('Wishlist item not found');
    await this.wishlistRepo.delete(item.id);
    return { message: 'Removed from wishlist' };
  }
}