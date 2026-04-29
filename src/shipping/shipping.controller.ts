import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ShippingService, CreateAddressDto } from './shipping.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { GetUser } from '../common/get-user.decorator';
import { UserEntity } from '../users/user.entity';

@Controller('shipping/address')
@UseGuards(JwtAuthGuard)
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.shippingService.findAll(user.id);
  }

  @Post()
  create(@GetUser() user: UserEntity, @Body() dto: CreateAddressDto) {
    return this.shippingService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @GetUser() user: UserEntity,
    @Param('id') id: string,
    @Body() dto: Partial<CreateAddressDto>,
  ) {
    return this.shippingService.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@GetUser() user: UserEntity, @Param('id') id: string) {
    return this.shippingService.remove(id, user.id);
  }
}