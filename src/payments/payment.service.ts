import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PaymentEntity, PaymentStatus, PaymentProvider } from './payment.entity';
import { OrderService } from '../orders/order.service';
import { InitializePaymentDto } from './payment.dto';
import { OrderStatus } from '../orders/order.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  private readonly paystackSecret: string;
  private readonly paystackBaseUrl: string;

  constructor(
    @InjectRepository(PaymentEntity) private paymentsRepo: Repository<PaymentEntity>,
    private orderService: OrderService,
    private configService: ConfigService,
  ) {
    this.paystackSecret = this.configService.get<string>('PAYSTACK_SECRET_KEY')!;
    this.paystackBaseUrl = this.configService.get<string>('PAYSTACK_BASE_URL!', 'https://api.paystack.co');
  }

  async initialize(userId: string, dto: InitializePaymentDto) {
    const order = await this.orderService.findOneForUser(dto.orderId, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be paid');
    }

    const reference = `EC-${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
    const amountInKobo = Math.round(Number(order.totalAmount) * 100);

    // Call Paystack initialization
    const response = await fetch(`${this.paystackBaseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: order.user.email,
        amount: amountInKobo,
        reference,
        metadata: { orderId: order.id, userId },
      }),
    });

    const data = await response.json() as any;
    if (!data.status) throw new BadRequestException(data.message || 'Payment initialization failed');

    // Save payment record
    const payment = this.paymentsRepo.create({
      userId,
      orderId: order.id,
      reference,
      amount: order.totalAmount,
      status: PaymentStatus.PENDING,
      provider: PaymentProvider.PAYSTACK,
    });
    await this.paymentsRepo.save(payment);

    return {
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference,
    };
  }

  async verify(reference: string) {
    const payment = await this.paymentsRepo.findOne({ where: { reference } });
    if (!payment) throw new NotFoundException('Payment not found');

    const response = await fetch(`${this.paystackBaseUrl}/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${this.paystackSecret}` },
    });

    const data = await response.json() as any;
    if (!data.status) throw new BadRequestException('Verification failed');

    const txStatus = data.data.status;

    if (txStatus === 'success') {
      await this.paymentsRepo.update(payment.id, {
        status: PaymentStatus.SUCCESS,
        providerResponse: JSON.stringify(data.data),
      });
      await this.orderService.markAsPaid(payment.orderId, reference);
      return { message: 'Payment successful', payment: { ...payment, status: PaymentStatus.SUCCESS } };
    }

    await this.paymentsRepo.update(payment.id, { status: PaymentStatus.FAILED });
    return { message: 'Payment not successful', status: txStatus };
  }

  async handleWebhook(payload: any) {
    const { event, data } = payload;

    if (event === 'charge.success') {
      const { reference } = data;
      const payment = await this.paymentsRepo.findOne({ where: { reference } });
      if (payment && payment.status !== PaymentStatus.SUCCESS) {
        await this.paymentsRepo.update(payment.id, {
          status: PaymentStatus.SUCCESS,
          providerResponse: JSON.stringify(data),
        });
        await this.orderService.markAsPaid(payment.orderId, reference);
      }
    }

    return { received: true };
  }

  async getUserPayments(userId: string): Promise<PaymentEntity[]> {
    return this.paymentsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}