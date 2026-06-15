import { PosService } from './pos.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleName } from '../roles/entities/role.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AddItemDto, UpdateQuantityDto, ApplyDiscountDto, CheckoutDto, CreateCartDto } from './dto/pos.dto';
import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';

@Controller('pos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PosController {
    constructor(private posService: PosService) { }

    @Post('cart')
    @Roles(RoleName.RESTAURANT_OWNER)
    createCart(
        @Request() req: { user: { restaurantId: number | null; userId: number } },
        @Body() body: CreateCartDto,
    ) {
        return this.posService.createCart(
            req.user.restaurantId,
            req.user.userId,
            body?.tableId,
            body?.terminalLabel,
        );
    }

    @Get('active-sessions')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    listActiveSessions(@Request() req: { user: { restaurantId?: number | null; role: string } }) {
        return this.posService.listActiveSessions(req.user.restaurantId, req.user.role);
    }

    @Get('cart/:id')
    @Roles(RoleName.RESTAURANT_OWNER)
    getCart(@Param('id') id: number) {
        return this.posService.getCart(id);
    }

    @Post('cart/:id/item')
    @Roles(RoleName.RESTAURANT_OWNER)
    addItem(@Param('id') id: number, @Body() dto: AddItemDto) {
        return this.posService.addItem(id, dto);
    }

    @Patch('cart/:id/quantity')
    @Roles(RoleName.RESTAURANT_OWNER)
    updateQuantity(@Param('id') id: number, @Body() dto: UpdateQuantityDto) {
        return this.posService.updateQuantity(id, dto);
    }

    @Patch('cart/:id/discount')
    @Roles(RoleName.RESTAURANT_OWNER)
    applyDiscount(@Param('id') id: number, @Body() dto: ApplyDiscountDto) {
        return this.posService.applyDiscount(id, dto);
    }

    @Post('cart/:id/checkout')
    @Roles(RoleName.RESTAURANT_OWNER)
    checkout(
        @Param('id') id: number,
        @Body() dto: CheckoutDto,
        @Request() req: { user: { userId: number; restaurantId: number | null } },
    ) {
        if (req.user.restaurantId == null) {
            throw new BadRequestException('Restaurant context is required');
        }
        return this.posService.checkout(id, dto, req.user.userId, req.user.restaurantId);
    }
}