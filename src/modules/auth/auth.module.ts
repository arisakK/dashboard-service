import { CacheModule, DynamicModule } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import RegisterCacheOptions from '../../cache.providers'

import { AuthController } from './auth.controller'
import { JwtStrategy } from './guards/jwt.strategy'

import { UsersService } from '../users/users.service'

import { RMQService } from '../../microservice.constants'
import { MakeRMQServiceProvider } from '../../microservice.providers'

export class AuthModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        CacheModule.registerAsync(RegisterCacheOptions),
        ClientsModule.register([MakeRMQServiceProvider(RMQService.Users)]),
      ],
      controllers: [AuthController],
      providers: [JwtStrategy, UsersService],
    }
  }
}
