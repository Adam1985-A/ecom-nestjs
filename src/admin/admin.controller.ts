import {
  Controller, Get, Patch, Delete, Body, Param,
  UseGuards, Query,
} from '@nestjs/common';
import { AdminService } from '../admin/admin.service.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/role.guard.js';
import { RoleDecorator } from '../common/role.decorator.js';
import { UpdateOrderStatusDto } from '../orders/order.dto.js';
import { ProductService } from '../products/product.service.js';
import { CreateProductDto, UpdateProductDto } from '../products/product.dto.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@RoleDecorator('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private productsService: ProductService,
  ) {}

  // ── Dashboard ──────────────────────────────────────────
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardSummary();
  }

  // ── Orders ─────────────────────────────────────────────
  @Get('orders')
  getOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.getAllOrders(page, limit);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto);
  }

  // ── Products ───────────────────────────────────────────
  @Get('products')
  getProducts(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.productsService.findAll({ page, limit });
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // ── Users ──────────────────────────────────────────────
  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  // ── Analytics ──────────────────────────────────────────
  @Get('analytics/sales')
  getSales() {
    return this.adminService.getSalesAnalytics();
  }

  @Get('analytics/top-products')
  getTopProducts(@Query('limit') limit = 10) {
    return this.adminService.getTopProducts(limit);
  }

  @Get('analytics/revenue')
  getRevenue() {
    return this.adminService.getRevenueByMonth();
  }
}