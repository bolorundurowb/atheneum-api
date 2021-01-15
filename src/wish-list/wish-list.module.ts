import { Module } from '@nestjs/common';
import { WishListController } from './wish-list.controller';

@Module({
  controllers: [WishListController]
})
export class WishListModule {}
