import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports:[UserModule,
     JwtModule.registerAsync({
      global:true,
      inject:[ConfigService],
      useFactory:async(configServe:ConfigService)=>({
        secret:configServe.get<string>('JWT_SECRET','defaultSecret!'),
        signOptions: { expiresIn: Number(configServe.get<string>('JWT_EXPIRES_IN','360000'))},
      }),
    }),
  ],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}
