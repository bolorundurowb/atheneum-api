/**
 * Created by bolorundurowb on 12/26/2020
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Author } from './author.schema';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop()
  isbn: string;

  @Prop()
  isbn13: string;

  @Prop()
  year: number;

  @Prop()
  summary: string;

  @Prop()
  coverArt: string;

  @Prop()
  publishedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }] })
  authors: Author[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
