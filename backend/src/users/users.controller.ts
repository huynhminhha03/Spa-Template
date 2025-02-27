import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { User } from './models/user.schema';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Role } from '../roles/role.enum';
import { UpdateInfoUserDto } from './dto/update-info-user.dto';
import { ChangePassUserDto } from './dto/change-password-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Route yêu cầu xác thực
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req: any): Promise<User> {
    const userId = req.user._id;
    return this.usersService.findOne(userId);
  }

  // Route công khai: không cần xác thực
  @Get(':username')
  async findBySlug(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update-info')
  async updateInfo(
    @Request() req: any,
    @Body() updateInfoUserDto: UpdateInfoUserDto,
  ): Promise<User> {
    const userId = req.user._id;
    const username = req.user.username;
    return this.usersService.updateInfo(userId, username, updateInfoUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update-password')
  async updatePassword(
    @Request() req: any,
    @Body() updatePassUserDto: ChangePassUserDto,
  ): Promise<User> {
    const userId = req.user._id;
    return this.usersService.updatePassword(userId, updatePassUserDto);
  }

  @Auth(Role.Admin)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Auth(Role.Admin)
  @Get('/admin/:id')
  async findOneByAdmin(@Param('id') id: string): Promise<User> {
    return this.usersService.findOneByAdmin(id);
  }

  @Auth(Role.Admin)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createByAdmin(createUserDto);
  }

  @Auth(Role.Admin)
  @Patch(':id')
  async updateByAdmin(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateInfoUserDto: UpdateUserByAdminDto,
  ): Promise<User> {
  
    return this.usersService.updateByAdmin( id, updateInfoUserDto);
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
