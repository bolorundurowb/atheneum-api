import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(emailAddress: string): Promise<User | undefined> {
    return this.userModel.findOne({
      emailAddress,
    });
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.userModel.findById(userId);
  }

  async create(emailAddress: string, password: string): Promise<User> {
    const user = new this.userModel({
      emailAddress: emailAddress,
      passwordHash: password,
    });
    return user.save();
  }

  async update(
    userId: string,
    firstName: string,
    lastname: string,
  ): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException(null, 'User account not found.');
    }

    user.firstName = firstName;
    user.lastName = lastname;
    // @ts-ignore
    await user.save();

    return user;
  }
}
