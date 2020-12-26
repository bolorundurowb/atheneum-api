/**
 * Created by bolorundurowb on 12/26/2020
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true })
  emailAddress: string;

  @Prop({
    set: (value) => {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(value, salt);
    },
  })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
