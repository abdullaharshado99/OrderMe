import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('chatbot_documents')
export class ChatbotDocument {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    restaurantId?: number;

    @Column()
    fileName?: string;

    @Column()
    fileUrl?: string;

    @Column()
    fileType?: string;

    @Column({ nullable: true })
    vectorId?: string;

    @CreateDateColumn()
    uploadedAt?: Date;
}