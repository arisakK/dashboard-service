import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UsersUpdateDto {
  @ApiProperty({
    type: String,
    example: 'displayName',
  })
  @IsNotEmpty()
  @IsString()
  displayName: string

  @ApiProperty({
    type: String,
    example: 'firstName',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string

  @ApiProperty({
    type: String,
    example: 'lastName',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string

  @ApiProperty({
    type: String,
    example: 'email@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string
}
