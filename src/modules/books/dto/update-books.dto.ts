import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

import EGenre from '../enum/genre.enum'

export class UpdateBooksDto {
  @ApiProperty({
    type: String,
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    type: String,
    example: '-',
  })
  @IsString()
  @IsNotEmpty()
  descr: string

  @ApiProperty({
    type: String,
    example: 'author',
  })
  @IsString()
  @IsNotEmpty()
  author: string

  @ApiProperty({
    enum: EGenre,
    example: EGenre.WESTERN,
  })
  @IsEnum(EGenre)
  @IsNotEmpty()
  genre: EGenre

  @ApiProperty({
    type: String,
    example: 'publisher',
  })
  @IsString()
  @IsNotEmpty()
  publisher: string

  @ApiProperty({
    type: Number,
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number

  @ApiProperty({
    type: String,
    example: '-',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string
}
