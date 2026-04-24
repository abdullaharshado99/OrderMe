import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminContentService } from '../services/admin-content.service';
import { CreateParaDto, UpdateParaDto, PaginationQueryDto } from '../dto/paras.dto';
import { Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body, Query, UseGuards } from '@nestjs/common';

@ApiTags('admin-paras')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/paras')
export class AdminParasController {
  constructor(private readonly adminContent: AdminContentService) { }

  @Get()
  list(@Query() query: PaginationQueryDto) {
    return this.adminContent.listParas(query);
  }

  @Post()
  create(@Body() dto: CreateParaDto) {
    return this.adminContent.createPara(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateParaDto) {
    return this.adminContent.updatePara(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminContent.deletePara(id);
  }

  @Get(':id/rukus')
  rukus(@Param('id', ParseIntPipe) id: number) {
    return this.adminContent.listRukus(id);
  }
}

