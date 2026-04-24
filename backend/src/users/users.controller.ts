import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateMeDto, ChangePasswordDto } from './dto/update-me.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Param, ParseIntPipe, UseGuards, Patch, Body, HttpCode, HttpStatus, Delete } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get current authenticated user' })
    @ApiResponse({ status: 200, description: 'Returns current user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMe(@CurrentUser() user: User) {
        return this.usersService.getMe(user.id);
    }

    @Patch('')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update current authenticated user profile (name/email)' })
    @ApiResponse({ status: 200, description: 'Returns updated user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateMe(@CurrentUser() user: User, @Body() dto: UpdateMeDto) {
        return this.usersService.updateMe(user.id, dto);
    }

    @Patch('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change password for current user' })
    async changePassword(@CurrentUser() user: User, @Body() dto: ChangePasswordDto) {
        await this.usersService.changePassword(user.id, dto);
        return { message: 'Password changed successfully' };
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Hard delete current authenticated user account (irreversible)' })
    async deleteMe(@CurrentUser() user: User) {
        await this.usersService.hardDeleteAccount(user.id);
        return;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, description: 'User' })
    @ApiResponse({ status: 404, description: 'User not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }
}