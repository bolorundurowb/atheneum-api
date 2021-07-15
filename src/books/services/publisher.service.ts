/**
 * Created by bolorundurowb on 1/3/2021
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publisher, PublisherDocument } from '../schemas/publisher.schema';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../schemas/book.schema';

@Injectable()
export class PublisherService {
  constructor(
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>
  ) {}

  async getAll(ownerId: any): Promise<Array<any>> {
    return this.publisherModel
      .find({
        owner: ownerId
      })
      .sort({ name: 'asc' });
  }

  async getTop(ownerId: any): Promise<Array<any>> {
    const result = await this.bookModel.aggregate([
      { $match: { owner: ownerId } },
      { $group: { _id: '$owner' } },
      { $project: { publisherId: '$_id' } }
    ]);
    return result;
  }
}
