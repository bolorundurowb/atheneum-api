import { Module } from '@nestjs/common';
import { WishListController } from './wish-list.controller';
import { WishListService } from './services/wish-list.service';

@Module({
  controllers: [WishListController],
  providers: [WishListService]
})
export class WishListModule {}
