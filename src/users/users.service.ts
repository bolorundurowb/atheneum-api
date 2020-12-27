import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
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

  async create(emailAddress: string, password: string): Promise<User> {
    const user = new this.userModel({
      emailAddress: emailAddress,
      passwordHash: password,
    });
    return await user.save();
  }
}
