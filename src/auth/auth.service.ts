import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, ResponseUserDto } from '../libs/dto';

@Injectable()
export class AuthService {
  constructor(
     private readonly jwtService: JwtService,
    private readonly userService: UserService,
   
  ) {}
  async register(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    console.log("I am new Registeration",CreateUserDto);
    const { username, email, password } = createUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
    });
    return user;
  }
 async login(
  loginUserDto: LoginUserDto
): Promise<{ accessToken: string; user: ResponseUserDto }> {
  console.log("I am login UserDto",loginUserDto);
  const { usernameOrEmail, password } = loginUserDto;
  const userDoc = await this.userService.findByUsername(usernameOrEmail);
  console.log("i am userdoc",userDoc);
  if (!userDoc) {
    throw new UnauthorizedException('Invalid credentials');
  }
  const isPasswordValid = await bcrypt.compare(password, userDoc.password);
  console.log("is password is valid",isPasswordValid);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }
  const payload = { sub: userDoc._id, role: userDoc.role };
  const accessToken = this.jwtService.sign(payload);
  console.log("i have accesstoken",accessToken);
  const { password: _, _id, ...rest } = userDoc;
  const responseUser: ResponseUserDto = {
    _id: _id.toString(),
    username: rest.username,
    email: rest.email,
    role: rest.role,
    isActive: rest.isActive,
  };

  return {
    accessToken,
    user: responseUser,
  };
}
 async profile(userId:string):Promise<ResponseUserDto>{
   const user=this.userService.findById(userId);
   if(!user){
    throw new UnauthorizedException("User not Found");
   }
   return user;
 }
 
}
