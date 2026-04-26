import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fcm_tokens')
export class FcmToken {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    userId?: number;

    @Column()
    token?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}