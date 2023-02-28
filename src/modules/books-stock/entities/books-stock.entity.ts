import { ApiProperty } from '@nestjs/swagger'

class BooksStockEntity {
  @ApiProperty({
    type: String,
    example: 'objectId',
  })
  objectId: string

  @ApiProperty({
    type: String,
    example: 'bookId',
  })
  bookId: string

  @ApiProperty({
    type: String,
    example: 'title',
  })
  title: string

  @ApiProperty({
    type: Number,
    example: 'quantity',
  })
  quantity: number

  @ApiProperty({
    type: Number,
    example: 'totalQuantity',
  })
  totalQuantity: number

  @ApiProperty({
    type: Number,
    example: 'quantityBought',
  })
  quantityBought: number

  @ApiProperty({
    type: Number,
    example: 'totalOrder',
  })
  totalOrder: number

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  lastOrderAt: Date

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  quantityUpdateAt: Date

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  lastStockCheck: Date

  @ApiProperty({
    type: String,
    example: 'ACTIVE',
  })
  status: string
}

export default BooksStockEntity
