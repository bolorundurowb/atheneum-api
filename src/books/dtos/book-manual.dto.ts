/**
 * Created by bolorundurowb on 1/3/2021
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class BookManualDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  summary: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(13)
  @IsNumberString()
  isbn: string;

  @ApiProperty()
  publishYear: number;

  @ApiProperty()
  authors: string;

  @ApiProperty()
  publisher: string;

  @ApiProperty()
  @IsOptional()
  pageCount?: number;
}
