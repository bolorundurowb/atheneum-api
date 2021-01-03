/**
 * Created by bolorundurowb on 12/26/2020
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Author } from './author.schema';
import { Publisher } from './publisher.schema';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  externalId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  summary: string;

  @Prop()
  isbn: string;

  @Prop()
  isbn13: string;

  @Prop()
  coverArt: string;

  @Prop()
  publishYear: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }] })
  authors: Array<Author>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' })
  publisher: Publisher;
}

export const BookSchema = SchemaFactory.createForClass(Book);
