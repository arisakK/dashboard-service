import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, Observable } from 'rxjs'

import { BooksQueryDto } from './dto/books-query.dto'
import { CreateBooksDto } from './dto/create-books.dto'
import { CreateInBooksStockDto } from './dto/create-in-books-stock.dto'
import { UpdateBooksDto } from './dto/update-books.dto'
import BooksEntity from './entities/books.entity'
import { BooksInterface } from './interfaces/books.interface'

import { PaginationResponseInterface } from '../../interfaces/pagination.interface'
import { BOOKS, RMQService } from '../../microservice.constants'

@Injectable()
export class BooksService {
  @Inject(RMQService.Books) private readonly booksService: ClientProxy

  async getPagination(
    query: BooksQueryDto,
  ): Promise<PaginationResponseInterface<BooksEntity>> {
    return lastValueFrom(
      this.booksService.send(
        {
          cmd: BOOKS,
          method: 'getPagination',
        },
        query,
      ),
    )
  }

  async getByObjectId(objectId: string): Promise<BooksInterface> {
    return lastValueFrom(
      this.booksService.send(
        {
          cmd: BOOKS,
          method: 'getByObjectId',
        },
        objectId,
      ),
    )
  }

  async getByTitle(title: string): Promise<BooksInterface> {
    return lastValueFrom(
      this.booksService.send(
        {
          cmd: BOOKS,
          method: 'getByTitle',
        },
        title,
      ),
    )
  }

  create(body: CreateBooksDto): Observable<any> {
    return this.booksService.emit(
      {
        cmd: BOOKS,
        method: 'create',
      },
      body,
    )
  }

  createInStock(body: CreateInBooksStockDto): Observable<any> {
    return this.booksService.emit(
      {
        cmd: BOOKS,
        method: 'create-in-stock',
      },
      body,
    )
  }

  update(objectId: string, body: UpdateBooksDto): Observable<any> {
    console.log(body)
    return this.booksService.emit(
      {
        cmd: BOOKS,
        method: 'update',
      },
      {
        objectId,
        body,
      },
    )
  }
}
