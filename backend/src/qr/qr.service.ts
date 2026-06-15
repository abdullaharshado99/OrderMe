import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { QrCode } from './entities/qr.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName } from '../roles/entities/role.entity';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class QrService {
    constructor(@InjectRepository(QrCode) private qrRepo: Repository<QrCode>) { }

    async generateQR(restaurantId: number, tableId: string, baseUrl: string, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        let qr = await this.qrRepo.findOne({ where: { restaurantId, tableId } });
        if (qr) return qr;
        const qrToken = uuidv4();
        const qrDataUrl = `${baseUrl}/order/menu?restaurant=${restaurantId}&table=${tableId}&token=${qrToken}`;
        const qrImageBuffer = await QRCode.toBuffer(qrDataUrl);
        const uploadDir = path.join(process.cwd(), 'uploads', 'qr', restaurantId.toString());
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const imageName = `${tableId}-${Date.now()}.png`;
        const imagePath = path.join(uploadDir, imageName);
        fs.writeFileSync(imagePath, qrImageBuffer);
        const qrImageUrl = `/uploads/qr/${restaurantId}/${imageName}`;
        qr = this.qrRepo.create({ restaurantId, tableId, qrToken, qrImageUrl });
        return this.qrRepo.save(qr);
    }

    async getQRForTable(restaurantId: number, tableId: string, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        const qr = await this.qrRepo.findOne({ where: { restaurantId, tableId } });
        if (!qr) throw new NotFoundException('QR not found for this table');
        return qr;
    }

    async listTables(restaurantId: number, currentUserRole: string, userRestaurantId?: number) {
        this.checkAccess(restaurantId, currentUserRole, userRestaurantId);
        return this.qrRepo.find({ where: { restaurantId } });
    }

    private checkAccess(restaurantId: number, role: string, userRestaurantId?: number) {
        if (role === RoleName.SUPER_ADMIN) return;
        if (role === RoleName.RESTAURANT_OWNER && userRestaurantId === restaurantId) return;
        throw new ForbiddenException('Access denied');
    }
}