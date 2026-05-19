import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NotificationsController {
    constructor(private notifService: NotificationsService) { }

    @Post('register-token')
    async registerToken(@Body('token') token: string, @Request() req) {
        return this.notifService.registerToken(req.user.userId, token);
    }

    // For admin/owner to send broadcast
    @Post('send')
    async send(@Body() payload: any, @Request() req) {
        return this.notifService.sendToUser(payload.userId, payload.title, payload.body);
    }
}