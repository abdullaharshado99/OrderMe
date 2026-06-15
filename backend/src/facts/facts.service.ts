import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Fact } from './entities/fact.entity';
import { CreateFactDto } from './dto/fact.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FactsService {
    constructor(
        @InjectRepository(Fact)
        private factRepo: Repository<Fact>,
    ) { }

    async create(dto: CreateFactDto) {
        const fact = this.factRepo.create(dto);
        return this.factRepo.save(fact);
    }

    async getRandomFact() {
        const count = await this.factRepo.count();
        if (count === 0) return { fact: 'No facts yet. Add some!' };
        const skip = Math.floor(Math.random() * count);
        const facts = await this.factRepo.find({ skip, take: 1 });
        return facts[0];
    }

    async findAll() {
        return this.factRepo.find();
    }

    async delete(id: number) {
        return this.factRepo.delete(id);
    }
}