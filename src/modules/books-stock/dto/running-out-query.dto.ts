import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, Max, Min } from 'class-validator'

export enum ESortRunningOutQuery {
  QUANTITY_ASC = 'quantity_asc',
  QUANTITY_DESC = 'quantity_desc',
}

export class RunningOutQueryDto {
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

  @ApiProperty({
    example: 10,
  })
  @Type(() => Number)
  @Max(10000)
  @Min(1)
  min: number

  @ApiProperty({
    enum: ESortRunningOutQuery,
    example: ESortRunningOutQuery.QUANTITY_ASC,
  })
  @IsEnum(ESortRunningOutQuery)
  @IsNotEmpty()
  kSort: ESortRunningOutQuery

  filter: Record<string, any>

  sort: Record<string, any>
}
