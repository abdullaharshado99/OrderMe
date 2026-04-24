import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminContentService } from '../services/admin-content.service';
import { CreateSurahDto, PaginationQueryDto, UpdateSurahDto } from '../dto/surahs.dto';
import { Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body, Query, UseGuards } from '@nestjs/common';

@ApiTags('admin-surahs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/surahs')
export class AdminSurahController {
  constructor(private readonly adminContent: AdminContentService) { }

  @Get()
  list(@Query() query: PaginationQueryDto) {
    return this.adminContent.listSurahs(query);
  }

  // @Get(':id/rukus')
  // surahRukus(@Param('id', ParseIntPipe) id: number) {
  //   return this.adminContent.listSurahs(id);
  // }

  @Post()
  create(@Body() dto: CreateSurahDto) {
    return this.adminContent.createSurah(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSurahDto) {
    return this.adminContent.updateSurah(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminContent.deleteSurah(id);
  }

  @Get(':id/rukus')
  rukus(@Param('id', ParseIntPipe) id: number) {
    return this.adminContent.listRukus(id);
  }
}

