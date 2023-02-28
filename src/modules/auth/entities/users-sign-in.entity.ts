import { ApiProperty } from '@nestjs/swagger'

export class UsersSignInEntity {
  @ApiProperty({
    type: String,
    example: 'accessToken',
  })
  accessToken: string

  @ApiProperty({
    type: String,
    example: 'refreshToken',
  })
  refreshToken: string
}
