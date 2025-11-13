import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from '../libs/dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
  @Get()
  async getAllUsers(): Promise<ResponseUserDto[]> {
    const users = await this.userService.getAllUsers();
    return users;
  }
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ResponseUserDto> {
    const user = await this.userService.findById(id);
    return user;
  }
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseUserDto> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return user;
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
