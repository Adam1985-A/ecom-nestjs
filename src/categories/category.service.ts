import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity.js';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoriesRepo: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoriesRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoriesRepo.findOne({ where: { id }, relations: ['products'] });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findProducts(id: string) {
    const category = await this.findOne(id);
    return category.products;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const exists = await this.categoriesRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Category name already exists');
    const category = this.categoriesRepo.create(dto);
    return this.categoriesRepo.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryEntity> {
    await this.findOne(id);
    await this.categoriesRepo.update(id, dto);
    const updated = await this.categoriesRepo.findOne({ where: { id } });
  if (!updated) {
    throw new NotFoundException('Category not found after update');
  }

  return updated;
}
  

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.categoriesRepo.delete(id);
    return { message: 'Category deleted' };
  }
}