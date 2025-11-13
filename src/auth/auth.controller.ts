import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../libs/dto';
import { ApiTags,ApiOperation,ApiResponse,ApiBearerAuth } from '@nestjs/swagger';
import { ResponseUserDto } from '../libs/dto';
import { Public } from './public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
 @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.', type: ResponseUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('profile')
 @ApiBearerAuth() // 🔑 Tells Swagger this route requires Bearer token
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiResponse({ status: 201, description: 'user Profile here .', type: ResponseUserDto })
  async profile(@Req() req ) {
    return this.authService.profile(req.user.sub);
  }

}
