import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '../payments/payment.entity.js';
import { PaymentService } from './payment.service.js';
import { PaymentController } from '../payments/payment.controller.js';
import { OrderModule } from '../orders/order.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), OrderModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}