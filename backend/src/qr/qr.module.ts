import { Module } from '@nestjs/common';
import { QrService } from './qr.service';
import { QrCode } from './entities/qr.entity';
import { QrController } from './qr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([QrCode])],
    controllers: [QrController],
    providers: [QrService],
})
export class QrModule { }