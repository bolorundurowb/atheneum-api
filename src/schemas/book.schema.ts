/**
 * Created by bolorundurowb on 12/26/2020
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop()
  isbn: string;

  @Prop()
  year: number;

  @Prop()
  summary: string;

  @Prop()
  coverArt: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
