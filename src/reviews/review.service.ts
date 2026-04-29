import {
  Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { ProductService } from '../products/product.service';
import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity) private reviewsRepo: Repository<ReviewEntity>,
    private productsService: ProductService,
  ) {}

  async create(userId: string, productId: string, dto: CreateReviewDto): Promise<ReviewEntity> {
    await this.productsService.findOne(productId);

    const existing = await this.reviewsRepo.findOne({ where: { userId, productId } });
    if (existing) throw new UnauthorizedException('You have already reviewed this product');

    if (dto.rating < 1 || dto.rating > 5) throw new UnauthorizedException('Rating must be 1–5');

    const review = this.reviewsRepo.create({ userId, productId, ...dto });
    const saved = await this.reviewsRepo.save(review);

    await this.recalculateRating(productId);
    return saved;
  }

  async findByProduct(productId: string): Promise<ReviewEntity[]> {
    await this.productsService.findOne(productId);
    return this.reviewsRepo.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const review = await this.reviewsRepo.findOne({ where: { id, userId } });
    if (!review) throw new UnauthorizedException('Review not found');
    await this.reviewsRepo.delete(id);
    await this.recalculateRating(review.productId);
    return { message: 'Review deleted' };
  }

  private async recalculateRating(productId: string): Promise<void> {
    const reviews = await this.reviewsRepo.find({ where: { productId } });
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
    await this.productsService.updateRating(productId, parseFloat(avg.toFixed(1)), count);
  }
}