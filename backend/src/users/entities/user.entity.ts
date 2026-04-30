import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  email?: string;

  @Column()
  password?: string; // hashed

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role?: Role;

  @Column()
  roleId?: number;

  @Column({ type: 'int', nullable: true })
  restaurantId?: number | null;

  @Column({ default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
