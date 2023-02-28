import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { BooksStockService } from '../../books-stock/books-stock.service'
import { BooksStockInterface } from '../../books-stock/interfaces/books-stock.interface'
import { BooksService } from '../../books/books.service'
import { BooksInterface } from '../../books/interfaces/books.interface'

import { LoggerService } from '../../logger/logger.service'
import { BuyBookDto } from '../dto/buy-book.dto'

@Injectable()
export class BuyBooksValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    BuyBooksValidationPipe.name,
  )

  constructor(
    private readonly booksService: BooksService,
    private readonly booksStockService: BooksStockService,
  ) {}

  async transform(body: BuyBookDto): Promise<BuyBookDto> {
    let bookStock: BooksStockInterface
    let book: BooksInterface
    try {
      bookStock = await this.booksStockService.getByBookId(body.bookId)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (!bookStock) {
      this.logger.error(`catch on books ${body.bookId} not found`)
      throw new BadRequestException({
        message: `${body.bookId} not found`,
      })
    }

    try {
      book = await this.booksService.getByObjectId(body.bookId)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (!book) {
      this.logger.error(`catch on books ${body.bookId} not found`)
      throw new BadRequestException({
        message: `${body.bookId} not found`,
      })
    }

    if (bookStock.quantity < 1) {
      this.logger.error(`catch on books: ${bookStock.title} sold out`)
      throw new BadRequestException({
        message: `${bookStock.title} sold out`,
      })
    }
    if (bookStock.quantity < body.quantity) {
      this.logger.error(`catch on books: ${bookStock.title} not enough`)
      throw new BadRequestException({
        message: `${bookStock.title} not enough`,
      })
    }

    body.bookStock = bookStock
    body.book = book
    return body
  }
}
