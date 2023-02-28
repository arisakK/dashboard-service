import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import isEqual from 'lodash/fp/isEqual'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const [req] = context.getArgs()
    const userPermissions: string = req?.user?.status
    const requiredPermissions = this.reflector.get(
      'permissionsBought',
      context.getHandler(),
    )

    if (isEqual(userPermissions, requiredPermissions)) {
      return true
    }

    throw new ForbiddenException('You do not have the right to buy.')
  }
}
