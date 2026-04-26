import { Controller, Post, Get, Delete, Param, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';

@Controller('documents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentsController {
    constructor(private docsService: DocumentsService) { }

    @Post('upload/:restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @Param('restaurantId') restaurantId: number,
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
    ) {
        return this.docsService.upload(restaurantId, file, req.user.role, req.user.restaurantId);
    }

    @Get(':restaurantId')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    findAll(@Param('restaurantId') restaurantId: number, @Request() req) {
        return this.docsService.findAll(restaurantId, req.user.role, req.user.restaurantId);
    }

    @Delete(':id')
    @Roles(RoleName.SUPER_ADMIN, RoleName.RESTAURANT_OWNER)
    remove(@Param('id') id: number, @Request() req) {
        return this.docsService.delete(id, req.user.role, req.user.restaurantId);
    }
}