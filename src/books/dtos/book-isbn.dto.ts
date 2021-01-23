/**
 * Created by bolorundurowb on 1/2/2021
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class BookIsbnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 13)
  isbn: string;

  @ApiProperty()
  @IsOptional()
  longitude?: number;

  @ApiProperty()
  @IsOptional()
  latitude?: number;
}
