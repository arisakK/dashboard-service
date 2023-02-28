import { ApiProperty } from '@nestjs/swagger'

class UsersOrderHistoryQueryEntity {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  page: number

  @ApiProperty({
    type: Number,
    example: 20,
  })
  perPage: number

  @ApiProperty({
    type: Number,
    example: 100,
  })
  count: number

  @ApiProperty({
    type: [],
  })
  records: []
}

export default UsersOrderHistoryQueryEntity
