import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { UserModule } from '../users/user.module.js';
import { ProductModule } from '../products/product.module.js';
import { CategoryModule } from '../categories/category.module.js';
import { CartModule } from '../cart/cart.module.js';
import { OrderModule } from '../orders/order.module.js';
import { PaymentModule } from '../payments/payment.module.js';
import { ReviewModule } from '../reviews/review.module.js';
import { WishlistModule } from '../wishlist/wishlist.module.js';
import { ShippingModule } from '../shipping/shipping.module.js';
import { AdminModule } from '../admin/admin.module.js';
import { DatabaseModule } from '../module/database.module.js';

// Entities
import { UserEntity } from '../users/user.entity.js';
import { ProductEntity } from '../products/product.entity.js';
import { CategoryEntity } from '../categories/category.entity.js';
import { CartEntity } from '../cart/cart.entity.js';
import { CartItem } from '../cart//cart-item.entity.js';
import { OrderEntity } from '../orders/order.entity.js';
import { OrderItem } from '../orders/order-item.entity.js';
import { PaymentEntity } from '../payments/payment.entity.js';
import { ReviewEntity } from '../reviews/review.entity.js';
import { WishlistItem } from '../wishlist/wishlist-item.entity.js';
import { ShippingAddress } from '../shipping/shipping-address.entity.js';
import { DatabaseService } from '../database/database-service.js';

@Module({
  imports: [
   
    TypeOrmModule.forRoot({
       type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'saidat1985',
        database: 'ecom-nestjs',
        entities: [
          UserEntity, ProductEntity, CategoryEntity, CartEntity, CartItem,
          OrderEntity, OrderItem, PaymentEntity, ReviewEntity, WishlistItem, ShippingAddress,
        ],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
  
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    PaymentModule,
    ReviewModule,
    WishlistModule,
    ShippingModule,
    AdminModule,
  ],
  providers: [DatabaseService],
})
export class AppModule {}