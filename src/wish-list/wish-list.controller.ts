import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wish List')
@UseGuards(JwtAuthGuard)
@Controller('wish-list')
export class WishListController {}
