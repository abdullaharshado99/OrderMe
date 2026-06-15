import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { RoleName } from '../roles/entities/role.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Controller, Get, Param, Query, UseGuards, Request, Header } from '@nestjs/common';

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
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    dashboard(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.analyticsService.getDashboard(restaurantId, req.user.role, req.user.restaurantId);
    }

    @Get('admin-stats')
    @Roles(RoleName.SUPER_ADMIN)
    async getAdminStats() {
        return this.analyticsService.getAdminStats();
    }
}