import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne} from "typeorm";
import { CategoryEntity} from "../categories/category.entity";
import { ReviewEntity } from "../reviews/review.entity";

@Entity()
export class ProductEntity{
@PrimaryGeneratedColumn("uuid")
id: string;

@Column({ type: "varchar", nullable: false })
name: string;

@Column({ type: "text", nullable: true})
description: string;

@Column({ type: "decimal", precision: 10, scale: 2})
price: number;

 @Column({ default: 0 })
  stock: number;

@Column({ type: "simple-array", nullable: true})
image: string[];

@Column({ default: true })
isActive: boolean;

@ManyToOne(() => CategoryEntity, (Categories) => Categories.products, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  categories: CategoryEntity;
 
  @Column({ nullable: true })
  categoryId: string;
 
  @OneToMany(() => ReviewEntity, (Review) => Review.product)
  reviews: ReviewEntity[];
 
  @Column({ type: 'float', default: 0 })
  averageRating: number;
 
  @Column({ default: 0 })
  reviewCount: number;
 
  @CreateDateColumn({ type: "timestamp"})
  createdAt: Date;
 
@UpdateDateColumn({ type: "timestamp", })
updatedAt: Date;
}