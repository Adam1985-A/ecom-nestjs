import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../products/product.dto.js';
import { ProductService } from './product.service.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/role.guard.js';
import { RoleDecorator } from '../common/role.decorator.js';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

 @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // Admin routes
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleDecorator('admin')
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleDecorator('admin')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleDecorator('admin')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}