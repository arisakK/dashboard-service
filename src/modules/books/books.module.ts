import { DynamicModule } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { BooksController } from './books.controller'
import { BooksService } from './books.service'

import { BooksStockService } from '../books-stock/books-stock.service'

import { RMQService } from '../../microservice.constants'
import { MakeRMQServiceProvider } from '../../microservice.providers'

export class BooksModule {
  static register(): DynamicModule {
    return {
      module: BooksModule,
      imports: [
        ClientsModule.register([MakeRMQServiceProvider(RMQService.Books)]),
      ],
      controllers: [BooksController],
      providers: [BooksService, BooksStockService],
    }
  }
}
