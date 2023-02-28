import { SetMetadata } from '@nestjs/common'

import EUserRoles from '../modules/users/enum/user-roles.enum'

export const UseRoles = (...roles: EUserRoles[]) => SetMetadata('roles', roles)
