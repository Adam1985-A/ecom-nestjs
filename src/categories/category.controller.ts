import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from '../categories/category.dto.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/role.guard.js';
import { RoleDecorator } from '../common/role.decorator.js';

@Controller('categories')
export class CategoryController {
  constructor(private categoriesService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id/products')
  findProducts(@Param('id') id: string) {
    return this.categoriesService.findProducts(id);
  }

  // Admin only below
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleDecorator('admin')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleDecorator('admin')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleDecorator('admin')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}