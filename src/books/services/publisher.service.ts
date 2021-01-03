/**
 * Created by bolorundurowb on 1/3/2021
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publisher, PublisherDocument } from '../schemas/publisher.schema';
import { Model } from 'mongoose';

@Injectable()
export class PublisherService {
  constructor(
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
  ) {}

  async getAll(ownerId: any): Promise<Array<any>> {
    return this.publisherModel
      .find({
        owner: ownerId,
      })
      .sort({ name: 'asc' });
  }
}
