import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Sku } from '../warehouse/entities/sku.entity';
import { PrepTask } from './entities/prep-task.entity';
import { WasteLog } from './entities/waste-log.entity';
import { KitchenInventoryService } from './kitchen-inventory.service';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { KitchenInventoryController } from './kitchen-inventory.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient, PrepTask, WasteLog, Sku])],
    controllers: [KitchenInventoryController],
    providers: [KitchenInventoryService],
})
export class KitchenInventoryModule { }