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
    fileUrl?: string; // stored path or S3 URL

    @Column()
    fileType?: string; // pdf, docx, txt

    @Column({ nullable: true })
    vectorId?: string; // Pinecone or pgvector ID

    @CreateDateColumn()
    uploadedAt?: Date;
}