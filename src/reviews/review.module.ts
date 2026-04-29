import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), ProductModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}