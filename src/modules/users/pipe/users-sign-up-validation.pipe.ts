import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcrypt'

import { UsersSignUpDto } from '../dto/users-sign-up.dto'
import { UsersInterface } from '../interface/users.interface'
import { UsersService } from '../users.service'

import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class UsersSignUpValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    UsersSignUpValidationPipe.name,
  )

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async transform(body: UsersSignUpDto): Promise<UsersSignUpDto> {
    let user: UsersInterface

    try {
      user = await this.userService.getByUsername(body.username)
    } catch (e) {
      this.logger.error(`catch on sign-up: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${body.username} is already`,
      })
    }
    if (user) {
      this.logger.error(`catch on sign-up: user ${body.username} is already`)
      throw new BadRequestException({
        message: `${body.username} is already`,
      })
    }

    const hashSize = this.configService.get<string>('authentication.hashSize')
    let hashPassword: string
    try {
      hashPassword = await bcrypt.hash(body.password, hashSize)
    } catch (e) {
      this.logger.error(`catch on sign-up: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }

    body.password = hashPassword
    return body
  }
}
