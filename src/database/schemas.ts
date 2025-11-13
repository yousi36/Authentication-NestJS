import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
}

@Schema({ timestamps: true })
export class User {

  _id: string;
  
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  refreshToken?: string; // optional for JWT refresh implementation
}

// Create schema
export const UserSchema = SchemaFactory.createForClass(User);
