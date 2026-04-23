import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { CartEntity } from '../cart/cart.entity.js';
import { ProductEntity } from '../products/product.entity.js';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CartEntity, (cartEntity) => cartEntity.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;

  @Column()
  cartId: string;

  @ManyToOne(() => ProductEntity, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column()
  productId: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtTime: number;

  @CreateDateColumn()
  createdAt: Date;
}