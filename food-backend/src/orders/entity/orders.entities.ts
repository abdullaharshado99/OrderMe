import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  tableId?: number;

  @Column()
  status?: string;

  @Column('json')
  items: any;
}
