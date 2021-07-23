import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { WishListModule } from './wish-list/wish-list.module';
import configuration from './config/configuration';
import { SharedModule } from './shared/shared.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    MongooseModule.forRoot(configuration().database.url),
    AuthModule,
    UsersModule,
    BooksModule,
    SharedModule,
    WishListModule,
    StatisticsModule
  ],
})
export class AppModule {}
