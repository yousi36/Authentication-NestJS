import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, ResponseUserDto } from '../libs/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const { username, email, password, role } = createUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
      role,
    });
    return user;
  }
 async login(
  loginUserDto: LoginUserDto
): Promise<{ accessToken: string; user: ResponseUserDto }> {
  const { usernameOrEmail, password } = loginUserDto;
  const userDoc = await this.userService.findByUsername(usernameOrEmail);
  if (!userDoc) {
    throw new UnauthorizedException('Invalid credentials');
  }
  const isPasswordValid = await bcrypt.compare(password, userDoc.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }
  const payload = { sub: userDoc._id, role: userDoc.role };
  const accessToken = this.jwtService.sign(payload);
  const { password: _, _id, ...rest } = userDoc.toObject();
  const responseUser: ResponseUserDto = {
    id: _id.toString(),
    username: rest.username,
    email: rest.email,
    role: rest.role,
    isActive: rest.isActive,
    createdAt: rest.createdAt,
    updatedAt: rest.updatedAt,
  };

  return {
    accessToken,
    user: responseUser,
  };
}
}
