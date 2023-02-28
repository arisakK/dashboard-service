import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

import { BooksInterface } from '../../books/interfaces/books.interface'

import { BooksStockInterface } from '../../books-stock/interfaces/books-stock.interface'

export class BuyBookDto {
  @ApiProperty({
    type: String,
    example: 'bookId',
  })
  @IsString()
  @IsNotEmpty()
  bookId: string

  @ApiProperty({
    type: Number,
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number

  bookStock: BooksStockInterface

  book: BooksInterface
}
