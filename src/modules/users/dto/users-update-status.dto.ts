import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { UsersStatusEnum } from '../enum/users-status.enum'

export class UsersUpdateStatusDto {
  @ApiProperty({
    enum: UsersStatusEnum,
    example: UsersStatusEnum.ACTIVE,
  })
  @IsEnum(UsersStatusEnum)
  status: UsersStatusEnum
}
