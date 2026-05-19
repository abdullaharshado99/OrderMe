import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sku } from './entities/sku.entity';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { StockTransfer } from './entities/stock-transfer.entity';
import { AuditLog } from './entities/audit-log.entity';
import { CreateSkuDto, CreateSupplierDto, CreatePurchaseOrderDto, ReceivePurchaseOrderDto, CreateStockTransferDto, UpdateTransferStatusDto } from './dto/warehouse.dto';
import { RoleName } from '../roles/entities/role.entity';

function startOfToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(Sku) private skuRepo: Repository<Sku>,
        @InjectRepository(Supplier) private supplierRepo: Repository<Supplier>,
        @InjectRepository(PurchaseOrder) private poRepo: Repository<PurchaseOrder>,
        @InjectRepository(PurchaseOrderItem) private poItemRepo: Repository<PurchaseOrderItem>,
        @InjectRepository(StockTransfer) private transferRepo: Repository<StockTransfer>,
        @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
    ) { }

    resolveRestaurantScope(restaurantId: number | null | undefined, role: string): number | null {
        if (restaurantId != null) return restaurantId;
        if (role === RoleName.SUPER_ADMIN) return null;
        throw new BadRequestException('Restaurant context is required');
    }

    async getDashboard(restaurantId: number | null | undefined, role: string) {
        const rid = this.resolveRestaurantScope(restaurantId, role);
        if (rid === null) {
            return {
                totalSkus: 0,
                skuAddedThisMonth: 0,
                stockValuePkr: 0,
                activePurchaseOrders: 0,
                purchaseOrdersArrivingToday: 0,
                belowMinLevelCount: 0,
                totalSuppliers: 0,
                activeSuppliersCount: 0,
            };
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const skus = await this.skuRepo.find({ where: { restaurantId: rid } });
        const skuAddedThisMonth = skus.filter((s) => s.createdAt && new Date(s.createdAt) >= startOfMonth).length;
        const stockValuePkr = skus.reduce((sum, s) => sum + Number(s.currentStock ?? 0) * Number(s.unitPrice ?? 0), 0);
        const belowMinLevelCount = skus.filter((s) => Number(s.currentStock ?? 0) <= Number(s.minLevel ?? 0)).length;

        const pos = await this.poRepo.find({ where: { restaurantId: rid } });
        const activePurchaseOrders = pos.filter((p) => p.status !== 'received' && p.status !== 'cancelled').length;
        const today = startOfToday();
        const purchaseOrdersArrivingToday = pos.filter((p) => {
            if (p.status === 'received' || p.status === 'cancelled') return false;
            if (!p.expectedDelivery) return false;
            const eta = new Date(p.expectedDelivery);
            return isSameCalendarDay(eta, today);
        }).length;

        const suppliers = await this.supplierRepo.find({ where: { restaurantId: rid } });
        const activeSuppliersCount = suppliers.filter((s) => s.isActive).length;

        return {
            totalSkus: skus.length,
            skuAddedThisMonth,
            stockValuePkr,
            activePurchaseOrders,
            purchaseOrdersArrivingToday,
            belowMinLevelCount,
            totalSuppliers: suppliers.length,
            activeSuppliersCount,
        };
    }

    async createSku(dto: CreateSkuDto, currentUserRole: string, restaurantIdFromUser?: number | null) {
        if (currentUserRole !== RoleName.SUPER_ADMIN && currentUserRole !== RoleName.RESTAURANT_OWNER) {
            throw new ForbiddenException('Access denied');
        }
        const sku = this.skuRepo.create({
            ...dto,
            ...(dto.restaurantId == null && restaurantIdFromUser != null ? { restaurantId: restaurantIdFromUser } : {}),
        });
        return this.skuRepo.save(sku);
    }

    async getAllSkus(restaurantId: number | null | undefined, role: string) {
        const rid = this.resolveRestaurantScope(restaurantId, role);
        if (rid === null) return this.skuRepo.find({ relations: ['preferredSupplier'] });
        return this.skuRepo.find({ where: { restaurantId: rid }, relations: ['preferredSupplier'] });
    }

    async updateSku(id: number, dto: Partial<CreateSkuDto>, role: string) {
        const sku = await this.skuRepo.findOne({ where: { id } });
        if (!sku) throw new NotFoundException('SKU not found');
        Object.assign(sku, dto);
        return this.skuRepo.save(sku);
    }

    async adjustStock(skuId: number, adjustment: number, reason: string, userId: number) {
        const sku = await this.skuRepo.findOne({ where: { id: skuId } });
        if (!sku) throw new NotFoundException('SKU not found');
        const oldStock = sku.currentStock;
        sku.currentStock! += adjustment;
        if (sku.currentStock! < 0) throw new BadRequestException('Stock cannot be negative');
        await this.skuRepo.save(sku);
        const audit = this.auditRepo.create({
            skuId,
            previousStock: oldStock,
            newStock: sku.currentStock,
            adjustment,
            reason,
            userId,
        });
        await this.auditRepo.save(audit);
        return sku;
    }

    async createSupplier(dto: CreateSupplierDto, role: string, restaurantIdFromUser?: number | null) {
        if (role !== RoleName.SUPER_ADMIN && role !== RoleName.RESTAURANT_OWNER) throw new ForbiddenException();
        const resolvedRid =
            dto.restaurantId ??
            restaurantIdFromUser ??
            null;
        if (resolvedRid == null && role !== RoleName.SUPER_ADMIN) {
            throw new BadRequestException('restaurantId is required');
        }
        return this.supplierRepo.save(this.supplierRepo.create({ ...dto, restaurantId: resolvedRid }));
    }

    async getSuppliers(restaurantId: number | null | undefined, role: string) {
        const rid = this.resolveRestaurantScope(restaurantId, role);
        if (rid === null) return this.supplierRepo.find({ order: { name: 'ASC' } });
        return this.supplierRepo.find({ where: { restaurantId: rid }, order: { name: 'ASC' } });
    }

    async createPurchaseOrder(dto: CreatePurchaseOrderDto, role: string, restaurantId: number | null | undefined) {
        if (role !== RoleName.SUPER_ADMIN && role !== RoleName.RESTAURANT_OWNER) throw new ForbiddenException();
        const rid = dto.restaurantId ?? restaurantId ?? null;
        if (rid == null) throw new BadRequestException('restaurantId is required');
        const poNumber = `PO-${Date.now()}`;
        const po = this.poRepo.create({
            poNumber,
            supplierId: dto.supplierId,
            restaurantId: rid,
            orderDate: new Date(dto.orderDate!),
            expectedDelivery: new Date(dto.expectedDelivery!),
            notes: dto.notes,
            status: 'draft',
        });
        const savedPo = await this.poRepo.save(po);
        if (dto.items?.length) {
            const items = dto.items.map((item) =>
                this.poItemRepo.create({
                    purchaseOrderId: savedPo.id,
                    skuId: item.skuId,
                    orderedQuantity: item.orderedQuantity,
                    unitPrice: item.unitPrice,
                    notes: item.notes,
                    receivedQuantity: 0,
                }),
            );
            await this.poItemRepo.save(items);
        }
        return savedPo;
    }

    async receivePurchaseOrder(dto: ReceivePurchaseOrderDto, userId: number) {
        const po = await this.poRepo.findOne({ where: { id: dto.purchaseOrderId }, relations: ['items'] });
        if (!po) throw new NotFoundException('PO not found');
        for (const rec of dto.receivedItems!) {
            const item = po.items!.find((i) => i.skuId === rec.skuId);
            if (!item) continue;
            item.receivedQuantity! += rec.receivedQuantity!;
            await this.poItemRepo.save(item);
            await this.adjustStock(rec.skuId!, rec.receivedQuantity!, `PO received ${po.poNumber}`, userId);
        }
        po.status = 'received';
        await this.poRepo.save(po);
        return po;
    }

    async createTransfer(dto: CreateStockTransferDto, userId: number, role: string, restaurantId: number | null | undefined) {
        if (role !== RoleName.SUPER_ADMIN && role !== RoleName.RESTAURANT_OWNER) throw new ForbiddenException();
        const rid = restaurantId ?? null;
        if (rid == null) throw new BadRequestException('restaurantId is required');
        const transfer = this.transferRepo.create({ ...dto, requestedById: userId, status: 'pending', restaurantId: rid });
        return this.transferRepo.save(transfer);
    }

    async updateTransferStatus(id: number, dto: UpdateTransferStatusDto, userId: number, role: string) {
        const transfer = await this.transferRepo.findOne({ where: { id } });
        if (!transfer) throw new NotFoundException('Transfer not found');
        if (role !== RoleName.SUPER_ADMIN && role !== RoleName.RESTAURANT_OWNER) throw new ForbiddenException();
        transfer.status = dto.status;
        if (dto.status === 'approved') {
            transfer.approvedById = userId;
            transfer.approvedAt = new Date();
        }
        if (dto.status === 'completed') {
            await this.adjustStock(transfer.skuId!, -transfer.quantity!, `Transferred to ${transfer.toLocation}`, userId);
        }
        return this.transferRepo.save(transfer);
    }

    async getAuditLogs(restaurantId: number | null | undefined, role: string, skuId?: number) {
        const rid = this.resolveRestaurantScope(restaurantId, role);
        const qb = this.auditRepo
            .createQueryBuilder('audit')
            .leftJoinAndSelect('audit.sku', 'sku')
            .leftJoinAndSelect('audit.user', 'user')
            .orderBy('audit.createdAt', 'DESC')
            .take(150);
        if (rid !== null) {
            qb.andWhere('sku.restaurantId = :rid', { rid });
        }
        if (skuId != null && !Number.isNaN(Number(skuId))) {
            qb.andWhere('audit.skuId = :skuId', { skuId });
        }
        return qb.getMany();
    }

    async getPurchaseOrders(restaurantId: number | null | undefined, role: string) {
        const rid = this.resolveRestaurantScope(restaurantId, role);
        const where = rid !== null ? { restaurantId: rid } : {};
        return this.poRepo.find({
            where,
            relations: ['supplier', 'items', 'items.sku'],
            order: { createdAt: 'DESC' },
        });
    }

    async getTransfers(restaurantId: number | null | undefined, role: string) {
        const rid = this.resolveRestaurantScope(restaurantId, role);
        const where = rid !== null ? { restaurantId: rid } : {};
        return this.transferRepo.find({
            where,
            relations: ['sku', 'requestedBy', 'approvedBy'],
            order: { createdAt: 'DESC' },
        });
    }
}
