import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SubscriptionsController {
    constructor(private subsService: SubscriptionsService) { }

    @Post()
    @Roles(RoleName.SUPER_ADMIN)
    create(@Body() dto: any, @Request() req) {
        return this.subsService.create(dto, req.user.role);
    }

    @Get('restaurant/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    findByRestaurant(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.subsService.findByRestaurant(restaurantId, req.user.role, req.user.restaurantId);
    }

    @Get('current/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    getCurrent(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.subsService.getCurrentSubscription(restaurantId, req.user.role, req.user.restaurantId);
    }

    @Patch('renew/:id')
    @Roles(RoleName.SUPER_ADMIN)
    renew(@Param('id') id: number, @Body() dto: any, @Request() req) {
        return this.subsService.renewSubscription(id, dto, req.user.role);
    }
}