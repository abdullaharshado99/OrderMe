import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('sales/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    salesReport(
        @Param('restaurantId') restaurantId: number,
        @Query('period') period: 'daily' | 'weekly' | 'monthly',
        @Request() req,
    ) {
        return this.analyticsService.getSalesReport(restaurantId, period, req.user.role, req.user.restaurantId);
    }

    @Get('popular/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    popularItems(
        @Param('restaurantId') restaurantId: number,
        @Query('limit') limit: number,
        @Request() req,
    ) {
        return this.analyticsService.getPopularItems(restaurantId, limit || 5, req.user.role, req.user.restaurantId);
    }

    @Get('dashboard/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    dashboard(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.analyticsService.getDashboard(restaurantId, req.user.role, req.user.restaurantId);
    }
}