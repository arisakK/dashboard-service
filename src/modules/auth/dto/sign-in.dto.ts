import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @ApiProperty({
    type: String,
    example: 'username',
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({
    type: String,
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
