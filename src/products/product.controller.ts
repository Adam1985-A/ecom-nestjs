import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/role.guard';
import { RoleDecorator } from '../common/role.decorator';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

 @Get()
 @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
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