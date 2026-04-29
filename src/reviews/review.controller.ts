import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewService, CreateReviewDto } from './review.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { GetUser } from '../common/get-user.decorator';
import { UserEntity } from '../users//user.entity';

@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  findAll(@Param('productId') productId: string) {
    return this.reviewService.findByProduct(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @GetUser() user: UserEntity,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.create(user.id, productId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@GetUser() user: UserEntity, @Param('id') id: string) {
    return this.reviewService.remove(id, user.id);
  }
}