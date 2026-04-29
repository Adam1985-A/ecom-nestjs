import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import type { FindOptionsWhere } from "typeorm";
import { ProductEntity } from './product.entity';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private productsRepo: Repository<ProductEntity>,
  ) {}

  async findAll(query: ProductQueryDto) {
    const { search, category, page = 1, limit = 20, sortBy = 'createdAt', order = 'DESC' } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<ProductEntity> = { isActive: true };
    if (search) where.name = ILike(`%${search}%`);
    if (category) where.categoryId = category;

    const [data, total] = await this.productsRepo.findAndCount({
      where,
      order: { [sortBy]: order },
      skip,
      take: limit,
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['reviews'],
    });
    if (!product) throw new UnauthorizedException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const product = this.productsRepo.create(dto);
    return this.productsRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    await this.findOne(id);
    await this.productsRepo.update(id, dto as any);
    const updated = await this.productsRepo.findOne({
    where: { id },
  });

  if (!updated) {
    throw new UnauthorizedException('Product not found after update');
  }

  return updated;
}

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.productsRepo.delete(id);

  if (result.affected === 0) {
    throw new UnauthorizedException('Product not found');
  }

    return { message: 'Product removed' };
  }

  async checkStock(productId: string, quantity: number): Promise<ProductEntity> {
    const product = await this.findOne(productId);
    if (product.stock < quantity) {
      throw new UnauthorizedException(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
    }
    return product;
  }

  async decrementStock(productId: string, quantity: number): Promise<void> {
    await this.productsRepo.decrement({ id: productId }, 'stock', quantity);
  }

  async updateRating(productId: string, avg: number, count: number): Promise<void> {
    await this.productsRepo.update(productId, { averageRating: avg, reviewCount: count });
  }
}