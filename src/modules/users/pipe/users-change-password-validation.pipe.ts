import {
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcrypt'

import { UsersChangePasswordDto } from '../dto/users-change-password.dto'

import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class UsersChangePasswordValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    UsersChangePasswordValidationPipe.name,
  )

  constructor(private readonly configService: ConfigService) {}

  async transform(
    body: UsersChangePasswordDto,
  ): Promise<UsersChangePasswordDto> {
    const hashSize = this.configService.get<string>('authentication.hashSize')
    let hashPassword: string
    try {
      hashPassword = await bcrypt.hash(body.changePassword, hashSize)
    } catch (e) {
      this.logger.error(
        `catch on hash-password: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }

    body.hashPassword = hashPassword
    return body
  }
}
