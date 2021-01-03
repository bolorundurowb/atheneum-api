/**
 * Created by bolorundurowb on 1/3/2021
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from '../schemas/author.schema';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name)
    private authorModel: Model<AuthorDocument>,
  ) {}

  async getAll(ownerId: any): Promise<Array<any>> {
    return this.authorModel
      .find({
        owner: ownerId,
      })
      .sort({ name: 'asc' });
  }
}
