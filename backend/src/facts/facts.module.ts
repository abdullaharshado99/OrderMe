import { Module } from '@nestjs/common';
import { Fact } from './entities/fact.entity';
import { FactsService } from './facts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactsController } from './facts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fact])],
  controllers: [FactsController],
  providers: [FactsService],
})
export class FactsModule { }