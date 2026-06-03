import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) { }

  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  create(@Body() createDto: CreateRestaurantDto, @Request() req) {
    return this.restaurantsService.create(createDto, req.user.role);
  }

  @Get()
  async findAll(@Request() req) {
    try {
      return await this.restaurantsService.findAll(req.user.role, req.user.restaurantId);
    } catch (err) {
      console.error('Error in RestaurantsController.findAll:', err);
      throw err;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req) {
    return this.restaurantsService.findOne(id, req.user.role, req.user.restaurantId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDto: any, @Request() req) {
    return this.restaurantsService.update(id, updateDto, req.user.role, req.user.restaurantId);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN)
  remove(@Param('id') id: number, @Request() req) {
    return this.restaurantsService.delete(id, req.user.role);
  }

  @Post('upload-logo/:restaurantId')
  @Roles(RoleName.RESTAURANT_OWNER, RoleName.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/restaurant-logos',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${unique}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files allowed'), false);
      }
      cb(null, true);
    }
  }))
  async uploadLogo(@Param('restaurantId') restaurantId: number, @UploadedFile() file: Express.Multer.File, @Request() req) {
    const restaurant = await this.restaurantsService.findOne(restaurantId, req.user.role, req.user.restaurantId);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    const logoUrl = `/uploads/restaurant-logos/${file.filename}`;
    await this.restaurantsService.update(restaurantId, { logoUrl }, req.user.role, req.user.restaurantId);
    return { logoUrl };
  }
}