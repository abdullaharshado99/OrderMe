import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KitchenInventoryController } from './kitchen-inventory.controller';
import { KitchenInventoryService } from './kitchen-inventory.service';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { PrepTask } from './entities/prep-task.entity';
import { WasteLog } from './entities/waste-log.entity';
import { Sku } from '../warehouse/entities/sku.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient, PrepTask, WasteLog, Sku])],
    controllers: [KitchenInventoryController],
    providers: [KitchenInventoryService],
})
export class KitchenInventoryModule { }