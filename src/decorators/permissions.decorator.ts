import { SetMetadata } from '@nestjs/common'

const UsePermissions = (...permissions) =>
  SetMetadata('permissionsBought', permissions)

export default UsePermissions
