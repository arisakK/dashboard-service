import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'

import { SignInDto } from './dto/sign-in.dto'
import { UsersSignInEntity } from './entities/users-sign-in.entity'
import { SignInUserValidationPipe } from './pipe/sign-in-user-validation.pipe'

import { LoggerService } from '../logger/logger.service'
import { UsersInterface } from '../users/interface/users.interface'
import { UsersService } from '../users/users.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger: LoggerService = new LoggerService(
    AuthController.name,
  )

  constructor(private readonly usersService: UsersService) {}

  @Post('users/sign-in')
  @SkipThrottle(true)
  @ApiBody({
    type: SignInDto,
  })
  @ApiResponse({
    status: 200,
    type: UsersSignInEntity,
  })
  async signIn(
    @Body(SignInUserValidationPipe) user: UsersInterface,
  ): Promise<UsersSignInEntity> {
    try {
      return this.usersService.signIn(user)
    } catch (e) {
      this.logger.error(`catch on login: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}
