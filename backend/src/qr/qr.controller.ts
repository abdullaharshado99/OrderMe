import { Controller, Get, Post, Param, Query, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { QrService } from './qr.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('qr')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class QrController {
    constructor(private qrService: QrService) { }

    @Post('generate/:restaurantId/:tableId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    async generate(
        @Param('restaurantId') restaurantId: number,
        @Param('tableId') tableId: string,
        @Request() req,
    ) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return this.qrService.generateQR(restaurantId, tableId, baseUrl, req.user.role, req.user.restaurantId);
    }

    @Get(':restaurantId/:tableId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    async getQR(@Param('restaurantId') restaurantId: number, @Param('tableId') tableId: string, @Request() req) {
        return this.qrService.getQRForTable(restaurantId, tableId, req.user.role, req.user.restaurantId);
    }

    @Get('tables/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    listTables(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.qrService.listTables(restaurantId, req.user.role, req.user.restaurantId);
    }
}