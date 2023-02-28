import { ApiProperty } from '@nestjs/swagger'

export class UsersEntity {
  @ApiProperty({
    type: String,
    example: 'objectId',
  })
  objectId: string

  @ApiProperty({
    type: String,
    example: 'username',
  })
  username: string

  @ApiProperty({
    type: String,
    example: 'email',
  })
  email: string

  @ApiProperty({
    type: String,
    example: 'mobile',
  })
  mobile: string

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isTwoFactorEnabled: boolean
}
