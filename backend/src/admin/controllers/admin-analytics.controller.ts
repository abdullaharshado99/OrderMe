import type { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminAnalyticsService } from '../services/admin-analytics.service';
import { Controller, Get, Param, ParseIntPipe, UseGuards, Res } from '@nestjs/common';

@ApiTags('admin-analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(private readonly analytics: AdminAnalyticsService) { }

  @Get('overview')
  overview() {
    return this.analytics.getOverview();
  }

  @Get('export')
  async exportCsv(@Res() res: Response) {
    const overview = await this.analytics.getOverview();
    const header = ['totalUsers', 'activeUsers', 'completedParas', 'completedRukus', 'averageQuizScore'];
    const row = [
      overview.totalUsers,
      overview.activeUsers,
      overview.completedParas,
      overview.completedRukus,
      overview.averageQuizScore,
    ];
    const csv = `${header.join(',')}\n${row.join(',')}\n`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="analytics-overview.csv"');
    res.send(csv);
  }
}