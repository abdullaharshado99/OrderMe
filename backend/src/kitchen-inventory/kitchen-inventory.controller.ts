import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { KitchenInventoryService } from './kitchen-inventory.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CreateRecipeDto, CreatePrepTaskDto, UpdatePrepTaskDto, CreateWasteLogDto } from './dto/kitchen-inventory.dto';

@Controller('kitchen-inventory')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class KitchenInventoryController {
    constructor(private service: KitchenInventoryService) { }

    // Recipes
    @Post('recipes')
    @Roles(RoleName.RESTAURANT_OWNER)
    createRecipe(@Body() dto: CreateRecipeDto, @Request() req) {
        return this.service.createRecipe(dto, req.user.role);
    }
    @Get('recipes')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.CHEF)
    getAllRecipes() {
        return this.service.getAllRecipes();
    }

    // Prep tasks
    @Post('prep-tasks')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.CHEF)
    createPrepTask(@Body() dto: CreatePrepTaskDto, @Request() req) {
        return this.service.createPrepTask(new Date(dto.date!), dto.skuId!, dto.targetQuantity!, req.user.role);
    }
    @Get('prep-tasks')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.CHEF)
    getPrepTasks() {
        return this.service.getPrepTasks();
    }
    @Patch('prep-tasks/:id')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.CHEF)
    updatePrepTask(@Param('id') id: number, @Body() dto: UpdatePrepTaskDto) {
        return this.service.updatePrepTask(id, dto.completedQuantity!);
    }

    // Waste logs
    @Post('waste')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.CHEF)
    logWaste(@Body() dto: CreateWasteLogDto, @Request() req) {
        return this.service.logWaste(dto.skuId!, dto.quantity!, dto.reason!, req.user.userId);
    }
    @Get('waste')
    @Roles(RoleName.RESTAURANT_OWNER, RoleName.CHEF)
    getWasteLogs() {
        return this.service.getWasteLogs();
    }
}