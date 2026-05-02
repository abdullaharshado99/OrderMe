import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Header } from '@nestjs/common';
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

    @Get('kitchen/:restaurantId')
    @Roles(RoleName.CHEF, RoleName.RESTAURANT_OWNER)
    getKitchenQueue(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.ordersService.getKitchenQueue(restaurantId, req.user.role === 'chef' ? req.user.userId : undefined);
    }
}