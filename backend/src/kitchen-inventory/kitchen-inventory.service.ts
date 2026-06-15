import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Sku } from '../warehouse/entities/sku.entity';
import { PrepTask } from './entities/prep-task.entity';
import { WasteLog } from './entities/waste-log.entity';
import { RoleName } from '../roles/entities/role.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class KitchenInventoryService {
    constructor(
        @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
        @InjectRepository(RecipeIngredient) private recipeIngRepo: Repository<RecipeIngredient>,
        @InjectRepository(PrepTask) private prepTaskRepo: Repository<PrepTask>,
        @InjectRepository(WasteLog) private wasteRepo: Repository<WasteLog>,
        @InjectRepository(Sku) private skuRepo: Repository<Sku>,
    ) { }

    async createRecipe(data: any, role: string) {
        if (role !== RoleName.RESTAURANT_OWNER) throw new ForbiddenException();
        const recipe = this.recipeRepo.create({ name: data.name, description: data.description, yieldQuantity: data.yieldQuantity, prepTimeMinutes: data.prepTimeMinutes, totalCost: 0 });
        const saved = await this.recipeRepo.save(recipe);
        let totalCost = 0;
        for (const ing of data.ingredients) {
            const sku = await this.skuRepo.findOne({ where: { id: ing.skuId } });
            if (!sku) throw new NotFoundException(`SKU ${ing.skuId} not found`);
            const unitPrice = sku.unitPrice ?? 0;
            const cost = unitPrice * ing.quantity;
            totalCost += cost;
            await this.recipeIngRepo.save({ recipeId: saved.id, skuId: ing.skuId, quantity: ing.quantity, unit: sku.unit });
        }
        saved.totalCost = totalCost;
        return this.recipeRepo.save(saved);
    }

    async getAllRecipes() { return this.recipeRepo.find({ relations: ['ingredients', 'ingredients.sku'] }); }

    async createPrepTask(date: Date, skuId: number, targetQty: number, role: string) {
        if (role !== RoleName.RESTAURANT_OWNER && role !== RoleName.CHEF) throw new ForbiddenException();
        return this.prepTaskRepo.save({ date, skuId, targetQuantity: targetQty });
    }

    async updatePrepTask(id: number, completedQty: number) {
        const task = await this.prepTaskRepo.findOne({ where: { id } });
        if (!task) throw new NotFoundException();
        task.completedQuantity = completedQty;
        const target = task.targetQuantity ?? 0;
        if (completedQty >= target) task.status = 'done';
        else if (completedQty > 0) task.status = 'in-progress';
        return this.prepTaskRepo.save(task);
    }

    async logWaste(skuId: number, quantity: number, reason: string, userId: number) {
        const sku = await this.skuRepo.findOne({ where: { id: skuId } });
        if (!sku) throw new NotFoundException(`SKU ${skuId} not found`);
        const unitPrice = sku.unitPrice ?? 0;
        const cost = unitPrice * quantity;
        return this.wasteRepo.save({ skuId, quantity, reason, estimatedCost: cost, reportedById: userId });
    }

    async getWasteLogs() { return this.wasteRepo.find({ relations: ['sku', 'reportedBy'], order: { createdAt: 'DESC' } }); }

    async getPrepTasks() {
        return this.prepTaskRepo.find({ relations: ['sku'], order: { date: 'ASC' } });
    }
}