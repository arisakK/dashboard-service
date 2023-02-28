import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common'
import { CONTEXT } from '@nestjs/microservices'
import bcrypt from 'bcrypt'
import { Cache } from 'cache-manager'

import { SignInDto } from '../dto/sign-in.dto'

import { AuthUtils } from '../../utils/auth/index'
import { LoggerService } from '../../logger/logger.service'
import { UsersInterface } from '../../users/interface/users.interface'
import { UsersService } from '../../users/users.service'

@Injectable({ scope: Scope.REQUEST })
export class SignInUserValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    SignInUserValidationPipe.name,
  )

  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  @Inject(CONTEXT) private readonly context

  constructor(private readonly userService: UsersService) {}

  async transform(body: SignInDto): Promise<UsersInterface> {
    let user: UsersInterface
    let matchPassword: boolean

    try {
      user = await this.userService.getByUsername(body.username)
    } catch (e) {
      this.logger.error(e?.message ?? JSON.stringify(e))
      throw new InternalServerErrorException({
        message: e?.message ?? JSON.stringify(e),
      })
    }
    if (!user) {
      throw new UnprocessableEntityException('Not Found User.')
    }

    const ip = this.context.headers['x-original-forwarded-for']
    const key = `${AuthUtils.generateKey(SignInUserValidationPipe.name, ip)}:${
      this.context.originalUrl
    }`
    const val: number = (await this.cacheManager.get(key)) || 0

    if (val > 2) {
      throw new UnprocessableEntityException('password is too wrong.')
    }

    try {
      matchPassword = await bcrypt.compare(body.password, user.password)
    } catch (e) {
      this.logger.error(`catch on login: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
    if (!matchPassword) {
      await this.cacheManager.set(key, val + 1, 30)
      throw new UnprocessableEntityException(
        `Password are not valid ${val + 1}.`,
      )
    }

    await this.cacheManager.del(key)
    return user
  }
}
