import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('qr_codes')
export class QrCode {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column()
    tableId?: string;

    @Column({ unique: true })
    qrToken?: string;

    @Column({ nullable: true })
    qrImageUrl?: string;

    @CreateDateColumn()
    createdAt?: Date;
}