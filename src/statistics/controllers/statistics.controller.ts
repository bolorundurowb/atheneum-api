/**
 * Created by bolorundurowb on 7/23/2021
 */
  
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Statistics')
@UseGuards(JwtAuthGuard)
@Controller('v1/statistics')
export class StatisticsController {

}
