import { Recipe } from './recipe.entity';
import { Sku } from '../../warehouse/entities/sku.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('recipe_ingredients')
export class RecipeIngredient {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Recipe, r => r.ingredients, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipeId' })
    recipe?: Recipe;
    @Column()
    recipeId?: number;

    @ManyToOne(() => Sku)
    @JoinColumn({ name: 'skuId' })
    sku?: Sku;
    @Column()
    skuId?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    quantity?: number;

    @Column({ nullable: true })
    unit?: string;
}