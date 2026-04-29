import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { ProductModule } from '../products/product.module';
import { CategoryModule } from '../categories/category.module';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../orders/order.module';
import { PaymentModule } from '../payments/payment.module';
import { ReviewModule } from '../reviews/review.module';
import { WishlistModule } from '../wishlist/wishlist.module';
import { ShippingModule } from '../shipping/shipping.module';
import { AdminModule } from '../admin/admin.module';
import { DatabaseModule } from './database.module';

// Entities
import { UserEntity } from '../users/user.entity';
import { ProductEntity } from '../products/product.entity';
import { CategoryEntity } from '../categories/category.entity';
import { CartEntity } from '../cart/cart.entity';
import { CartItem } from '../cart//cart-item.entity';
import { OrderEntity } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { PaymentEntity } from '../payments/payment.entity';
import { ReviewEntity } from '../reviews/review.entity';
import { WishlistItem } from '../wishlist/wishlist-item.entity';
import { ShippingAddress } from '../shipping/shipping-address.entity';
import { DatabaseService } from '../database/database-service';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),
   
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
        logging: false,
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