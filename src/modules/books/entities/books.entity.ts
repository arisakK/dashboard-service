import { ApiProperty } from '@nestjs/swagger'

import EGenre from '../../books-stock/enum/genre.enum'

class BooksEntity {
  @ApiProperty({
    type: String,
    example: 'objectId',
  })
  objectId: string

  @ApiProperty({
    type: String,
    example: 'title',
  })
  title: string

  @ApiProperty({
    type: String,
    example: 'descr',
  })
  descr: string

  @ApiProperty({
    type: String,
    example: 'author',
  })
  author: string

  @ApiProperty({
    enum: EGenre,
    example: EGenre.MYSTERY,
  })
  genre: EGenre

  @ApiProperty({
    type: String,
    example: 'publisher',
  })
  publisher: string

  @ApiProperty({
    type: Number,
    example: 100,
  })
  price: number

  @ApiProperty({
    type: String,
    example: 'imageUrl',
  })
  imageUrl: string

  @ApiProperty({
    type: String,
    example: 'ACTIVE',
  })
  status?: string
}

export default BooksEntity
