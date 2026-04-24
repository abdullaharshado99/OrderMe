import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateRukuDto, UpdateRukuDto } from '../dto/rukus.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminContentService } from '../services/admin-content.service';
import { Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body, Query, UseGuards } from '@nestjs/common';

@ApiTags('admin-rukus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/rukus')
export class AdminRukusController {
  constructor(private readonly adminContent: AdminContentService) { }

  @Get()
  list(@Query('paraId') paraId?: string) {
    return this.adminContent.listRukus(paraId ? +paraId : undefined);
  }

  @Post()
  create(@Body() dto: CreateRukuDto) {
    return this.adminContent.createRuku(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRukuDto) {
    return this.adminContent.updateRuku(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminContent.deleteRuku(id);
  }
}

