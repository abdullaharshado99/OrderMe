import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('qr_codes')
export class QrCode {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column()
    tableId?: string; // table number or identifier

    @Column({ unique: true })
    qrToken?: string; // unique token for URL

    @Column({ nullable: true })
    qrImageUrl?: string;

    @CreateDateColumn()
    createdAt?: Date;
}