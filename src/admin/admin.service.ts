import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OrderEntity, OrderStatus } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { UserEntity } from '../users/user.entity';
import { ProductEntity } from '../products/product.entity';
import { OrderService } from '../orders/order.service';
import { UserService } from '../users/user.service';
import { UpdateOrderStatusDto } from '../orders/order.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(OrderEntity) private ordersRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItem) private orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    @InjectRepository(ProductEntity) private productsRepo: Repository<ProductEntity>,
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  // ── Orders ──────────────────────────────────────────────
  async getAllOrders(page = 1, limit = 20) {
    return this.orderService.findAll(page, limit);
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }

  // ── Users ────────────────────────────────────────────────
  async getAllUsers() {
    return this.userService.findAll();
  }

  async deactivateUser(id: string) {
    return this.userService.deactivate(id);
  }

  // ── Analytics ────────────────────────────────────────────
  async getSalesAnalytics() {
    const totalOrders = await this.ordersRepo.count();
    const paidOrders = await this.ordersRepo.count({ where: { status: OrderStatus.PAID } });
    const pendingOrders = await this.ordersRepo.count({ where: { status: OrderStatus.PENDING } });
    const cancelledOrders = await this.ordersRepo.count({ where: { status: OrderStatus.CANCELLED } });

    const revenueResult = await this.ordersRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', {
        statuses: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      })
      .getRawOne();

    const totalRevenue = parseFloat(revenueResult?.total || '0');

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenueResult = await this.ordersRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', {
        statuses: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      })
      .andWhere('order.createdAt >= :startOfMonth', { startOfMonth })
      .getRawOne();

    const monthlyRevenue = parseFloat(monthlyRevenueResult?.total || '0');

    return {
      totalOrders,
      paidOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue,
      monthlyRevenue,
    };
  }

  async getTopProducts(limit = 10) {
    const result = await this.orderItemsRepo
      .createQueryBuilder('item')
      .select('item.productId', 'productId')
      .addSelect('item.productName', 'productName')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .addSelect('SUM(item.quantity * item.priceAtTime)', 'totalRevenue')
      .groupBy('item.productId')
      .addGroupBy('item.productName')
      .orderBy('totalSold', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((r) => ({
      productId: r.productId,
      productName: r.productName,
      totalSold: parseInt(r.totalSold),
      totalRevenue: parseFloat(r.totalRevenue),
    }));
  }

  async getRevenueByMonth() {
    const result = await this.ordersRepo
      .createQueryBuilder('order')
      .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
      .addSelect('SUM(order.totalAmount)', 'revenue')
      .addSelect('COUNT(order.id)', 'orderCount')
      .where('order.status IN (:...statuses)', {
        statuses: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      })
      .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return result.map((r) => ({
      month: r.month,
      revenue: parseFloat(r.revenue),
      orderCount: parseInt(r.orderCount),
    }));
  }

  async getDashboardSummary() {
    const totalUsers = await this.usersRepo.count();
    const totalProducts = await this.productsRepo.count({ where: { isActive: true } });
    const lowStockProducts = await this.productsRepo.find({
      where: [{ stock: 0 }, { stock: 1 }, { stock: 2 }, { stock: 3 }, { stock: 4 }, { stock: 5 }],
      select: ['id', 'name', 'stock'],
      order: { stock: 'ASC' },
    });

    const sales = await this.getSalesAnalytics();

    return {
      totalUsers,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5),
      ...sales,
    };
  }
}