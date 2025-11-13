import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schemas';
import { CreateUserDto, UpdateUserDto } from '../libs/dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // -------------------
  // Create a new user
  // -------------------
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // -------------------
  // Find user by ID
  // -------------------
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // -------------------
  // Find user by username or email
  // -------------------
  async findByUsername(usernameOrEmail: string): Promise<User | null> {
    return this.userModel
      .findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      })
      .exec();
  }

  // -------------------
  // Update user
  // -------------------
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  // -------------------
  // List all users
  // -------------------
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // -------------------
  // Delete user
  // -------------------
  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }
}
