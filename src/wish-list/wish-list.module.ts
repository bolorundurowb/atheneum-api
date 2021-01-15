import { Module } from '@nestjs/common';
import { WishListController } from './wish-list.controller';
import { WishListService } from './services/wish-list.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WishList, WishListSchema } from './schemas/wish-list.schema';

@Module({
  controllers: [WishListController],
  providers: [WishListService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: WishList.name, schema: WishListSchema },
    ]),
  ],
})
export class WishListModule {}
