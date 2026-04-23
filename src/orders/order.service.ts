import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../orders/order.entity.js';
import { OrderItem } from '../orders/order-item.entity.js';
import { CartService } from '../cart/cart.service.js';
import { ProductService } from '../products/product.service.js';
import { CreateOrderDto, UpdateOrderStatusDto } from '../orders/order.dto.js';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private ordersRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItem) private orderItemsRepo: Repository<OrderItem>,
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async createFromCart(userId: string, dto: CreateOrderDto): Promise<OrderEntity> {
    const { cart, total } = await this.cartService.getCartTotal(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock for all items before creating order
    for (const item of cart.items) {
      await this.productService.checkStock(item.productId, item.quantity);
    }

    // Create order
    const order = this.ordersRepo.create({
      userId,
      totalAmount: total,
      shippingAddress: dto.shippingAddress,
      ...(dto.notes !== undefined && { notes: dto.notes }),
      status: OrderStatus.PENDING,
    });
    const savedOrder = await this.ordersRepo.save(order as OrderEntity);

    // Create order items & decrement stock
    for (const cartItem of cart.items) {
      const orderItem = this.orderItemsRepo.create({
        orderId: savedOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtTime: cartItem.priceAtTime,
        productName: cartItem.product.name,
      });
      await this.orderItemsRepo.save(orderItem);
      await this.productService.decrementStock(cartItem.productId, cartItem.quantity);
    }

    // Clear cart after order creation
    await this.cartService.clearCart(userId);

    return this.findOne(savedOrder.id);
  }

  async findAllByUser(userId: string): Promise<OrderEntity[]> {
    return this.ordersRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<OrderEntity> {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findOneForUser(id: string, userId: string): Promise<OrderEntity> {
    const order = await this.ordersRepo.findOne({ where: { id, userId } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // Admin
  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.ordersRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderEntity> {
    const order = await this.findOne(id);
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled order');
    }
    await this.ordersRepo.update(id, { status: dto.status });
    return this.findOne(id);
  }

  async markAsPaid(orderId: string, paymentReference: string): Promise<OrderEntity> {
    await this.ordersRepo.update(orderId, {
      status: OrderStatus.PAID,
      paymentReference,
    });
    return this.findOne(orderId);
  }
}