import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotDocument } from './entities/document.entity';
import { RoleName } from '../roles/entities/role.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(ChatbotDocument)
        private docRepo: Repository<ChatbotDocument>,
    ) { }

    async upload(
        restaurantId: number,
        file: Express.Multer.File,
        currentUserRole: string,
        userRestaurantId?: number,
    ) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        // Save file to local storage (or S3)
        const uploadDir = path.join(process.cwd(), 'uploads', restaurantId.toString());
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const uniqueName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, uniqueName);
        fs.writeFileSync(filePath, file.buffer);
        const doc = this.docRepo.create({
            restaurantId,
            fileName: file.originalname,
            fileUrl: `/uploads/${restaurantId}/${uniqueName}`,
            fileType: file.mimetype,
        });
        const saved = await this.docRepo.save(doc);
        // TODO: Notify Mr. A (AI developer) via webhook or queue to vectorize
        return saved;
    }

    async findAll(restaurantId: number, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        return this.docRepo.find({ where: { restaurantId }, order: { uploadedAt: 'DESC' } });
    }

    async delete(id: number, currentUserRole: string, userRestaurantId?: number) {
        const doc = await this.docRepo.findOne({ where: { id } });
        if (!doc) throw new NotFoundException('Document not found');
        this.checkAccess(doc.restaurantId!, currentUserRole, userRestaurantId);
        // Delete physical file
        const filePath = path.join(process.cwd(), doc.fileUrl!);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return this.docRepo.remove(doc);
    }

    private checkAccess(restaurantId: number, role: string, userRestaurantId?: number) {
        if (role === RoleName.SUPER_ADMIN) return;
        if (role === RoleName.RESTAURANT_OWNER && userRestaurantId === restaurantId) return;
        throw new ForbiddenException('Access denied');
    }
}