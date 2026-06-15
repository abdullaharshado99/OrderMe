import { AuthGuard } from '@nestjs/passport';
import { FactsService } from './facts.service';
import { CreateFactDto } from './dto/fact.dto';
import { RoleName } from '../roles/entities/role.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';

@Controller('facts')
export class FactsController {
    constructor(private factsService: FactsService) { }

    @Get('random')
    getRandomFact() {
        return this.factsService.getRandomFact();
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleName.SUPER_ADMIN)
    getAll() {
        return this.factsService.findAll();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleName.SUPER_ADMIN)
    create(@Body() dto: CreateFactDto) {
        return this.factsService.create(dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleName.SUPER_ADMIN)
    remove(@Param('id') id: number) {
        return this.factsService.delete(id);
    }
}