import { UpdateSettingsDto } from '../dto/settings.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AdminSettingsService } from '../services/admin-settings.service';

@ApiTags('admin-settings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/settings')
export class AdminSettingsController {
    constructor(private readonly service: AdminSettingsService) { }

    @Get()
    getSettings() {
        return this.service.getSettings();
    }

    @Put()
    update(@Body() dto: UpdateSettingsDto) {
        return this.service.updateSettings(dto);
    }
}