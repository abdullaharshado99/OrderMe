import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  CHEF = 'CHEF',
  CASHIER = 'CASHIER',
  CUSTOMER = 'CUSTOMER',
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
