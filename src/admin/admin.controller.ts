import {
  Controller, Get, Patch, Delete, Body, Param,
  UseGuards, Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/role.guard';
import { RoleDecorator } from '../common/role.decorator';
import { UpdateOrderStatusDto } from '../orders/order.dto';
import { ProductService } from '../products/product.service';
import { CreateProductDto, UpdateProductDto } from '../products/product.dto';
import { UserRole }from '../users/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)

export class AdminController {
  constructor(
    private adminService: AdminService,
    private productService: ProductService,
  ) {}

  @RoleDecorator(UserRole.ADMIN)
@Get("admin-test")
testAdmin(){
  return 'Admin access granted';
}

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
    return this.productService.findAll({ page, limit });
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.remove(id);
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