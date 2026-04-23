import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddress } from '../shipping/shipping-address.entity.js';
import { ShippingService } from '../shipping//shipping.service.js';
import { ShippingController } from '../shipping/shipping.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingAddress])],
  providers: [ShippingService],
  controllers: [ShippingController],
  exports: [ShippingService],
})
export class ShippingModule {}