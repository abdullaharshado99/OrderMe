import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitersController } from './waiters.controller';
import { WaitersService } from './waiters.service';
import { Waiter } from './entities/waiter.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Waiter])],
    controllers: [WaitersController],
    providers: [WaitersService],
})
export class WaitersModule { }