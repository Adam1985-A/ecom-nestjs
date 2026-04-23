import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../reviews/review.entity.js';
import { ReviewService } from '../reviews/review.service.js';
import { ReviewController } from '../reviews/review.controller.js';
import { ProductModule } from '../products/product.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), ProductModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}