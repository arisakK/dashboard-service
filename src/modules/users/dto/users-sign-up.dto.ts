import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'

export class UsersSignUpDto {
  @ApiProperty({
    type: String,
    example: 'username',
  })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({
    type: String,
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string

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

  @ApiProperty({
    type: String,
    example: '0912345678',
  })
  @IsNotEmpty()
  @IsPhoneNumber('TH')
  mobile: string
}
