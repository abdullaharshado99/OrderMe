import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRukuMediaDto } from '../dto/ruku-media.dto';
import { UpdateRukuMediaDto } from '../dto/ruku-media.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RukuMediaService } from '../../content/ruku-media.service';
import { Body, Controller, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';

@ApiTags('admin-ruku-media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER-ADMIN')
@Controller('admin/ruku-media')
export class AdminRukuMediaController {
  constructor(private readonly rukuMediaService: RukuMediaService) { }

  @Post()
  create(@Body() dto: CreateRukuMediaDto) {
    return this.rukuMediaService.create(dto);
  }

  @Put(':id')
  putById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRukuMediaDto,
  ) {
    return this.rukuMediaService.updateById(id, dto);
  }

  @Patch('ruku/:rukuId')
  patch(
    @Param('rukuId', ParseIntPipe) rukuId: number,
    @Body() dto: UpdateRukuMediaDto,
  ) {
    return this.rukuMediaService.update(rukuId, dto);
  }
}