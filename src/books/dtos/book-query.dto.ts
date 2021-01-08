/**
 * Created by bolorundurowb on 1/8/2021
 */
import { ApiProperty } from '@nestjs/swagger';

export class BookQueryDto {
  @ApiProperty()
  search?: string;

  @ApiProperty()
  skip = 0;

  @ApiProperty()
  limit = 30;
}
