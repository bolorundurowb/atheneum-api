import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { WishListModule } from './wish-list/wish-list.module';
import configuration from './config/configuration';

@Module({
  imports: [
    MongooseModule.forRoot(configuration().database.url),
    AuthModule,
    UsersModule,
    BooksModule,
    WishListModule,
  ],
})
export class AppModule {}
