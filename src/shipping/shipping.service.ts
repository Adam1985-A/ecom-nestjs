import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingAddress } from './shipping-address.entity';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsString() fullName: string;
  @IsString() phoneNumber: string;
  @IsString() addressLine1: string;
  @IsOptional() @IsString() addressLine2?: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;
}

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingAddress) private addressRepo: Repository<ShippingAddress>,
  ) {}

  async findAll(userId: string): Promise<ShippingAddress[]> {
    return this.addressRepo.find({ where: { userId }, order: { isDefault: 'DESC', createdAt: 'DESC' } });
  }

  async create(userId: string, dto: CreateAddressDto): Promise<ShippingAddress> {
    if (dto.isDefault) {
      await this.addressRepo.update({ userId }, { isDefault: false });
    }
    const address = this.addressRepo.create({ ...dto, userId });
    return this.addressRepo.save(address);
  }

  async update(id: string, userId: string, dto: Partial<CreateAddressDto>): Promise<ShippingAddress> {
    const address = await this.addressRepo.findOne({ where: { id, userId } });
    if (!address) throw new NotFoundException('Address not found');
    if (dto.isDefault) {
      await this.addressRepo.update({ userId }, { isDefault: false });
    }
    await this.addressRepo.update(id, dto);
    const updated = await this.addressRepo.findOne({ where: { id } });
  if (!updated) throw new NotFoundException('Address not found after update');

  return updated;

  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const address = await this.addressRepo.findOne({ where: { id, userId } });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressRepo.delete(id);
    return { message: 'Address deleted' };
  }
}