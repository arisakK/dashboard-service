import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { Max, Min } from 'class-validator'

export class UsersHistoryQueryDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @Min(1)
  page: number

  @ApiProperty({
    example: 20,
  })
  @Type(() => Number)
  @Max(100)
  @Min(1)
  perPage: number
}
