/**
 * Created by bolorundurowb on 1/8/2021
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class BookQueryDto {
  @ApiProperty()
  @IsOptional()
  search?: string;

  @ApiProperty()
  @IsNumberString()
  skip: string;

  @ApiProperty()
  @IsNumberString()
  limit: string;

  @ApiProperty()
  @IsOptional()
  available?: boolean;

  @ApiProperty()
  @IsOptional()
  publisherId?: string;

  @ApiProperty()
  @IsOptional()
  authorId?: string;
}
