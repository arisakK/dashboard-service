import EUserRoles from '../enum/user-roles.enum'

export interface UsersInterface {
  objectId: string

  username: string

  email: string

  mobile: string

  password: string

  displayName: string

  firstName: string

  lastName: string

  status: string

  token?: string

  latestLogin?: Date

  refreshToken?: string

  twoFactorSecret?: string

  isTwoFactorEnabled: boolean

  refAf?: string

  roles?: EUserRoles

  permissions?: string[]
}
