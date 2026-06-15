import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('facts')
export class Fact {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'text' })
    fact?: string;

    @CreateDateColumn()
    createdAt?: Date;
}