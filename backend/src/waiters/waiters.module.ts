import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Waiter } from './entities/waiter.entity';
import { WaitersService } from './waiters.service';
import { WaitersController } from './waiters.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Waiter])],
    controllers: [WaitersController],
    providers: [WaitersService],
})
export class WaitersModule { }