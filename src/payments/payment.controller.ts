import {
  Controller, Post, Get, Body, Param, UseGuards, Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePaymentDto } from './payment.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { GetUser } from '../common/get-user.decorator';
import { UserEntity } from '../users/user.entity';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  initialize(@GetUser() user: UserEntity, @Body() dto: InitializePaymentDto) {
    return this.paymentService.initialize(user.id, dto);
  }

  @Get('verify/:reference')
  @UseGuards(JwtAuthGuard)
  verify(@Param('reference') reference: string) {
    return this.paymentService.verify(reference);
  }

  // Paystack calls this — no JWT, validate with Paystack signature in production
  @Post('webhook')
  webhook(@Body() payload: any) {
    return this.paymentService.handleWebhook(payload);
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  myPayments(@GetUser() user: UserEntity) {
    return this.paymentService.getUserPayments(user.id);
  }
}