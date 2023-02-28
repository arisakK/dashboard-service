import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, Observable } from 'rxjs'

import { AddBooksStockDto } from './dto/add-books-stock.dto'
import { BooksStockQueryDto } from './dto/books-stock-query.dto'
import { RunningOutQueryDto } from './dto/running-out-query.dto'
import BooksStockEntity from './entities/books-stock.entity'
import { BooksStockInterface } from './interfaces/books-stock.interface'
import { UpdateBooksStockInterface } from './interfaces/update-books-stock.interface'

import { PaginationResponseInterface } from '../../interfaces/pagination.interface'
import { BOOKS_STOCK, RMQService } from '../../microservice.constants'

@Injectable()
export class BooksStockService {
  @Inject(RMQService.Books) private readonly booksStockService: ClientProxy

  async getPagination(
    query: BooksStockQueryDto,
  ): Promise<PaginationResponseInterface<BooksStockEntity>> {
    return lastValueFrom(
      this.booksStockService.send(
        {
          cmd: BOOKS_STOCK,
          method: 'getPagination',
        },
        query,
      ),
    )
  }
  async getRunningOut(query: RunningOutQueryDto) {
    return lastValueFrom(
      this.booksStockService.send(
        {
          cmd: BOOKS_STOCK,
          method: 'getRunningOut',
        },
        query,
      ),
    )
  }

  async getByObjectId(objectId: string): Promise<BooksStockInterface> {
    return lastValueFrom(
      this.booksStockService.send(
        {
          cmd: BOOKS_STOCK,
          method: 'getByObjectId',
        },
        objectId,
      ),
    )
  }

  async getByBookId(bookId: string): Promise<BooksStockInterface> {
    return lastValueFrom(
      this.booksStockService.send(
        {
          cmd: BOOKS_STOCK,
          method: 'getByBookId',
        },
        bookId,
      ),
    )
  }

  addBookStock(body: AddBooksStockDto): Observable<any> {
    return this.booksStockService.emit(
      {
        cmd: BOOKS_STOCK,
        method: 'addBookStock',
      },
      {
        bookId: body.bookId,
        title: body.book.title,
        quantity: body.quantity,
      },
    )
  }
  addQuantity(stock: BooksStockInterface, quantity: number) {
    return this.booksStockService.emit(
      {
        cmd: BOOKS_STOCK,
        method: 'addQuantity',
      },
      {
        stock,
        quantity,
      },
    )
  }

  updateStock(
    objectId: string,
    body: UpdateBooksStockInterface,
  ): Observable<any> {
    return this.booksStockService.emit(
      {
        cmd: BOOKS_STOCK,
        method: 'update-stock',
      },
      {
        objectId,
        body,
      },
    )
  }
}
