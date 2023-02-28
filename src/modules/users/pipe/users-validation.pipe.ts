import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

import { UsersInterface } from '../interface/users.interface'
import { UsersService } from '../users.service'

import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class UserValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    UserValidationPipe.name,
  )

  constructor(private readonly userService: UsersService) {}

  async transform(objectId: string): Promise<UsersInterface> {
    let user: UsersInterface
    try {
      user = await this.userService.getByObjectId(objectId)
    } catch (e) {
      this.logger.error(`catch on find user ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${objectId} not found`,
      })
    }
    if (!user) {
      this.logger.error(`catch on find user: user ${objectId} not found`)
      throw new BadRequestException({
        message: `${objectId} not found`,
      })
    }

    return user
  }
}
