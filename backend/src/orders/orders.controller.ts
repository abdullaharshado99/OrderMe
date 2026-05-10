import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Header, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Post('restaurant/:restaurantId')
    @Roles(RoleName.CUSTOMER, RoleName.RESTAURANT_OWNER)
    create(@Param('restaurantId') restaurantId: number, @Body() dto: any, @Request() req) {
        return this.ordersService.createOrder(restaurantId, dto);
    }

    @Get('restaurant/:restaurantId')
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER, RoleName.CHEF)
    getRestaurantOrders(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.ordersService.getOrdersForRestaurant(restaurantId, req.user.role, req.user.restaurantId);
    }

    @Get(':orderId')
    getOrder(@Param('orderId') orderId: number, @Request() req) {
        return this.ordersService.getOrderById(orderId, req.user.role, req.user.restaurantId);
    }

    @Patch(':orderId/status')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER, RoleName.CHEF)
    updateStatus(@Param('orderId') orderId: number, @Body('status') status: any, @Request() req) {
        return this.ordersService.updateOrderStatus(orderId, status, req.user.role, req.user.restaurantId);
    }

    @Patch(':orderId/assign-chef')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    assignChef(@Param('orderId') orderId: number, @Body('chefId') chefId: number, @Request() req) {
        return this.ordersService.assignChef(orderId, chefId, req.user.role, req.user.restaurantId);
    }

    @Get('kitchen/queue/:restaurantId')
    @Roles(RoleName.CHEF, RoleName.RESTAURANT_OWNER)
    getKitchenQueue(@Param('restaurantId') id: number, @Query('station') station?: string) {
        return this.ordersService.getKitchenQueue(id, station);
    }

    @Patch(':orderId/station')
    @Roles(RoleName.CHEF, RoleName.RESTAURANT_OWNER)
    updateStation(@Param('orderId') id: number, @Body('station') station: string) {
        return this.ordersService.updateOrderStation(id, station);
    }

    @Post(':orderId/bump')
    @Roles(RoleName.CHEF, RoleName.RESTAURANT_OWNER)
    bumpOrder(@Param('orderId') id: number, @Request() req) {
        return this.ordersService.bumpOrder(id, req.user.userId);
    }

    @Get('kds/stats/:restaurantId')
    @Roles(RoleName.CHEF, RoleName.RESTAURANT_OWNER)
    getKdsStats(@Param('restaurantId') id: number) {
        return this.ordersService.getKdsStats(id);
    }
}