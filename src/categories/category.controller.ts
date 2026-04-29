import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/role.guard';
import { RoleDecorator } from '../common/role.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private categoriesService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
findOne(@Param('id') id: string) {
  return this.categoriesService.findOne(id);
}

  @Get(':id/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
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