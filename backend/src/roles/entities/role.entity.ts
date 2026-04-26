import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RoleName {
  SUPER_ADMIN = 'super-admin',
  RESTAURANT_OWNER = 'restaurant-owner',
  CHEF = 'chef',
  CUSTOMER = 'customer',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'enum', enum: RoleName, default: RoleName.CUSTOMER })
  name?: RoleName;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}