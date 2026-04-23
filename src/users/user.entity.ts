import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity("user")
export class UserEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", nullable: true})
    name: string;

   
    @Column({ type: "varchar", unique: true})
    email!: string;

    @Column({ type: "varchar"})
    password!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

     @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;
 
  @Column({ default: true })
  isActive: boolean;

  
}