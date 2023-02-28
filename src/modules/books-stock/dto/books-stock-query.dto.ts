import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, Max, Min } from 'class-validator'

export enum ESortBooksQuery {
  QUANTITY_ASC = 'quantity_asc',
  QUANTITY_DESC = 'quantity_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

export class BooksStockQueryDto {
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

  @ApiPropertyOptional({
    description: '',
  })
  @IsOptional()
  s?: string

  @ApiPropertyOptional({
    description: '',
  })
  @IsOptional()
  title: string

  select: string | any

  @ApiProperty({
    enum: ESortBooksQuery,
    example: ESortBooksQuery.PRICE_ASC,
  })
  @IsEnum(ESortBooksQuery)
  @IsNotEmpty()
  kSort: ESortBooksQuery

  filter: Record<string, any>

  sort: Record<string, any>
}
