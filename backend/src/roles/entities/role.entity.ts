import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type RoleName = 'SUPER_ADMIN' | 'MANAGER' | 'RESTAURANT_OWNER' | 'CHEF' | 'CUSTOMER';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  name?: RoleName;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => User, (user) => user.role)
  users?: User[];
}
