/**
 * Created by bolorundurowb on 12/26/2020
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Author } from './author.schema';
import { Publisher } from './publisher.schema';
import * as shortId from 'shortid';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ default: shortId.generate })
  _id: string;

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

  @Prop({ type: String, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: String, ref: 'Author' }] })
  authors: Array<Author>;

  @Prop({ type: String, ref: 'Publisher' })
  publisher: Publisher;
}

export const BookSchema = SchemaFactory.createForClass(Book);
