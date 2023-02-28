import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

import { BooksStockService } from '../books-stock.service'
import { AddBooksStockDto } from '../dto/add-books-stock.dto'
import { BooksStockInterface } from '../interfaces/books-stock.interface'

import { BooksService } from '../../books/books.service'
import { BooksInterface } from '../../books/interfaces/books.interface'
import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class AddBooksStockValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    AddBooksStockValidationPipe.name,
  )

  constructor(
    private readonly booksService: BooksService,
    private readonly booksStockService: BooksStockService,
  ) {}

  async transform(body: AddBooksStockDto): Promise<AddBooksStockDto> {
    let stock: BooksStockInterface
    try {
      stock = await this.booksStockService.getByBookId(body.bookId)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (stock) {
      this.logger.error(`catch on addStock: book ${body.bookId} is already`)
      throw new BadRequestException({
        message: `book ${body.bookId} is already`,
      })
    }

    let book: BooksInterface
    try {
      book = await this.booksService.getByObjectId(body.bookId)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (!book) {
      this.logger.error(
        `catch on find addStock: books ${body.bookId} not found`,
      )
      throw new BadRequestException({
        message: `${body.bookId} not found`,
      })
    }

    body.book = book
    return body
  }
}
