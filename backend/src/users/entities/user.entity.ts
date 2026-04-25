import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  email?: string;

  @Column()
  passwordHash?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: true })
  isActive?: boolean;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role?: Role;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
