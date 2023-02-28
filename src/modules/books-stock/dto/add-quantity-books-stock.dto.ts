import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class AddQuantityBooksStockDto {
  @ApiProperty({
    type: Number,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  quantity: number
}
