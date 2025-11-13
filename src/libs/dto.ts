import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username for login' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

}
export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;
}
export class ResponseUserDto {
  @ApiProperty({ description: 'Unique user ID' })
  _id: string;

  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'Role of the user' })
  role: string;

  @ApiProperty({ description: 'Is the user active?' })
  isActive: boolean;

}

export class LoginUserDto {
  @ApiProperty({ description: 'Username or email for login' })
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({ description: 'Password for login' })
  @IsString()
  password: string;
}