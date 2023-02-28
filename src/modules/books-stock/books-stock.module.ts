import { DynamicModule } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { BooksStockController } from './books-stock.controller'
import { BooksStockService } from './books-stock.service'

import { BooksService } from '../books/books.service'
import { UsersOrderService } from '../users-order/users-order.service'

import { RMQService } from '../../microservice.constants'
import { MakeRMQServiceProvider } from '../../microservice.providers'

export class BooksStockModule {
  static register(): DynamicModule {
    return {
      module: BooksStockModule,
      imports: [
        ClientsModule.register([MakeRMQServiceProvider(RMQService.Books)]),
      ],
      controllers: [BooksStockController],
      providers: [BooksService, BooksStockService, UsersOrderService],
    }
  }
}
