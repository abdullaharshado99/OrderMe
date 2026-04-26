import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FcmToken } from './entities/fcm-token.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    constructor(
        @InjectRepository(FcmToken)
        private tokenRepo: Repository<FcmToken>,
    ) {
        // Initialize Firebase Admin SDK (once)
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                // or provide service account JSON
            });
        }
    }

    async registerToken(userId: number, token: string) {
        let existing = await this.tokenRepo.findOne({ where: { userId, token } });
        if (!existing) {
            existing = this.tokenRepo.create({ userId, token });
            await this.tokenRepo.save(existing);
        }
        return { success: true };
    }

    async sendToUser(userId: number, title: string, body: string, data?: any) {
        const tokens = await this.tokenRepo.find({ where: { userId } });
        if (!tokens.length) return { success: false, reason: 'no tokens' };
        const messages = tokens.map(t => ({
            notification: { title, body },
            data: data ? { ...data } : undefined,
            token: t.token,
        }));
        const responses = await Promise.allSettled(
            messages.map(msg => admin.messaging().send(msg as any))
        );
        this.logger.log(`Sent ${responses.length} notifications`);
        return { success: true, responses };
    }

    async sendToRestaurantStaff(restaurantId: number, title: string, body: string, role?: string) {
        // You need to query users with this restaurantId and role, then get their tokens
        // For brevity, we skip full implementation – you can extend.
        return { message: 'implement based on user query' };
    }
}