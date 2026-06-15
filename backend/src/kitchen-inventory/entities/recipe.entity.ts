import { RecipeIngredient } from './recipe-ingredient.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('recipes')
export class Recipe {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column({ nullable: true })
    description?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    yieldQuantity?: number;

    @Column({ nullable: true })
    prepTimeMinutes?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalCost?: number;

    @OneToMany(() => RecipeIngredient, (ri: RecipeIngredient) => ri.recipe, { cascade: true })
    ingredients?: RecipeIngredient[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}