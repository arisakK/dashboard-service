import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

import { BooksInterface } from '../../books/interfaces/books.interface'

export class AddBooksStockDto {
  @ApiProperty({
    type: String,
    example: 'bookId',
  })
  @IsString()
  @IsNotEmpty()
  bookId: string

  @ApiProperty({
    type: Number,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  quantity: number

  book: BooksInterface
}
