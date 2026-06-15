import { AuthGuard } from '@nestjs/passport';
import { WarehouseService } from './warehouse.service';
import { RoleName } from '../roles/entities/role.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CreateSkuDto, CreateSupplierDto, CreatePurchaseOrderDto, ReceivePurchaseOrderDto, CreateStockTransferDto, UpdateTransferStatusDto } from './dto/warehouse.dto';

@Controller('warehouse')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class WarehouseController {
    constructor(private service: WarehouseService) { }

    @Get('dashboard')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    getDashboard(@Request() req: { user: { restaurantId?: number | null; role: string } }) {
        return this.service.getDashboard(req.user.restaurantId, req.user.role);
    }

    @Post('skus')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    createSku(@Body() dto: CreateSkuDto, @Request() req: { user: { restaurantId?: number | null; role: string } }) {
        return this.service.createSku(dto, req.user.role, req.user.restaurantId);
    }

    @Get('skus')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    getAllSkus(@Request() req: { user: { restaurantId?: number | null; role: string } }) {
        return this.service.getAllSkus(req.user.restaurantId, req.user.role);
    }

    @Patch('skus/:id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    updateSku(@Param('id') id: number, @Body() dto: Partial<CreateSkuDto>, @Request() req: { user: { role: string } }) {
        return this.service.updateSku(id, dto, req.user.role);
    }

    @Patch('skus/:id/stock')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    async adjustStock(
        @Param('id') id: number,
        @Body() body: { adjustment: number; reason: string },
        @Request() req: { user: { userId: number } },
    ) {
        return this.service.adjustStock(id, body.adjustment, body.reason, req.user.userId);
    }

    @Post('suppliers')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    createSupplier(@Body() dto: CreateSupplierDto, @Request() req: { user: { restaurantId?: number | null; role: string } }) {
        return this.service.createSupplier(dto, req.user.role, req.user.restaurantId);
    }

    @Get('suppliers')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    getSuppliers(@Request() req: { user: { restaurantId?: number | null; role: string } }) {
        return this.service.getSuppliers(req.user.restaurantId, req.user.role);
    }

    @Get('purchase-orders')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    getPurchaseOrders(@Request() req: { user: { restaurantId?: number | null; role: string } }) {
        return this.service.getPurchaseOrders(req.user.restaurantId, req.user.role);
    }

    @Post('purchase-orders')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    createPO(
        @Body() dto: CreatePurchaseOrderDto,
        @Request() req: { user: { role: string; restaurantId?: number | null } },
    ) {
        return this.service.createPurchaseOrder(dto, req.user.role, req.user.restaurantId);
    }

    @Post('purchase-orders/receive')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    receivePO(@Body() dto: ReceivePurchaseOrderDto, @Request() req: { user: { userId: number } }) {
        return this.service.receivePurchaseOrder(dto, req.user.userId);
    }

    @Get('transfers')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    getTransfers(@Request() req: { user: { restaurantId?: number | null; role: string } }) {
        return this.service.getTransfers(req.user.restaurantId, req.user.role);
    }

    @Post('transfers')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    createTransfer(
        @Body() dto: CreateStockTransferDto,
        @Request() req: { user: { userId: number; restaurantId?: number | null; role: string } },
    ) {
        return this.service.createTransfer(dto, req.user.userId, req.user.role, req.user.restaurantId);
    }

    @Patch('transfers/:id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    updateTransfer(
        @Param('id') id: number,
        @Body() dto: UpdateTransferStatusDto,
        @Request() req: { user: { userId: number; role: string } },
    ) {
        return this.service.updateTransferStatus(id, dto, req.user.userId, req.user.role);
    }

    @Get('audit')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    getAudit(@Request() req: { user: { restaurantId?: number | null; role: string } }, @Query('skuId') skuId?: number) {
        return this.service.getAuditLogs(req.user.restaurantId, req.user.role, skuId !== undefined ? Number(skuId) : undefined);
    }
}