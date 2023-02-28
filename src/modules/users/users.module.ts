import { DynamicModule } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { UsersController } from './users.controller'
import { UsersService } from './users.service'

import { JwtStrategy } from '../auth/guards/jwt.strategy'
import { BooksStockService } from '../books-stock/books-stock.service'
import { BooksService } from '../books/books.service'
import { UsersOrderService } from '../users-order/users-order.service'

import { RMQService } from '../../microservice.constants'
import { MakeRMQServiceProvider } from '../../microservice.providers'

export class UsersModule {
  static register(): DynamicModule {
    return {
      module: UsersModule,
      imports: [
        ClientsModule.register([
          MakeRMQServiceProvider(RMQService.Users),
          MakeRMQServiceProvider(RMQService.Books),
        ]),
      ],
      controllers: [UsersController],
      providers: [
        BooksService,
        BooksStockService,
        UsersService,
        UsersOrderService,
        JwtStrategy,
      ],
    }
  }
}
