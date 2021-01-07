/**
 * Created by bolorundurowb on 1/3/2021
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class BookManualDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  summary: string;

  @ApiProperty()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty()
  @IsNotEmpty()
  isbn13: string;

  @ApiProperty()
  publishYear: number;

  @ApiProperty()
  @IsNotEmpty()
  authorIds: Array<string>;

  @ApiProperty()
  @IsNotEmpty()
  publisherId: string;

  @ApiProperty()
  coverArt?: string;

  @ApiProperty()
  pageCount?: number;

  @ApiProperty()
  @IsOptional()
  longitude?: number;

  @ApiProperty()
  @IsOptional()
  latitude?: number;
}
