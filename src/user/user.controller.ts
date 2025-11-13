import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from '../libs/dto';
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';

ApiTags("user")
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiBearerAuth()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
  @Get()
  @ApiBearerAuth()
  async getAllUsers(): Promise<ResponseUserDto[]> {
    console.log("i am inside all user end point of controller");
    const users = await this.userService.getAllUsers();
    console.log("i am all usser",users);
    return users;
  }
  @Get(':id')
  @ApiBearerAuth()
  async getUserById(@Param('id') id: string): Promise<ResponseUserDto> {
    console.log("i am inside of user Controller of")
    const user = await this.userService.findById(id);
    return user;
  }
  @Patch(':id')
  @ApiBearerAuth()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseUserDto> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return user;
  }
  @Delete(':id')
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
