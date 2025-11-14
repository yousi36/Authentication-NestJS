import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
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

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  refreshToken?: string; // optional for JWT refresh implementation

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }) 
  role: Types.ObjectId; // user belongs to a role
}

// Create schema
export const UserSchema = SchemaFactory.createForClass(User);




export type PermissionDocument =Permission & Document;
@Schema({ timestamps: true })
export class Permission extends Document {
  @Prop({ required: true, unique: true })
  name: string; 
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);


//Role Schemas

export type RoleDocument=Role & Document;
@Schema()
export class Role extends Document {
  @Prop({ required: true ,default:"Employee"})
  name: UserRole;  

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Permission.name }] })
  permissions: Types.ObjectId[];  // references permissions
}

export const RoleSchema = SchemaFactory.createForClass(Role);
