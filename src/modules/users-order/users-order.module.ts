import { DynamicModule } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { UsersOrderService } from './users-order.service'

import { RMQService } from '../../microservice.constants'
import { MakeRMQServiceProvider } from '../../microservice.providers'

export class UsersOrderModule {
  static register(): DynamicModule {
    return {
      module: UsersOrderModule,
      imports: [
        ClientsModule.register([MakeRMQServiceProvider(RMQService.Books)]),
      ],
      providers: [UsersOrderService],
    }
  }
}
