import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

import { BooksService } from '../books.service'
import { BooksInterface } from '../interfaces/books.interface'
import { CreateInBooksStockDto } from '../dto/create-in-books-stock.dto'

import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class CreateInBooksStockValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    CreateInBooksStockValidationPipe.name,
  )

  constructor(private readonly booksService: BooksService) {}

  async transform(body: CreateInBooksStockDto): Promise<CreateInBooksStockDto> {
    let book: BooksInterface
    try {
      book = await this.booksService.getByTitle(body.title)
    } catch (e) {
      this.logger.error(
        `catch on book-title: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (book) {
      this.logger.error(`catch on book-title: title ${body.title} is already`)
      throw new BadRequestException({
        message: `title ${body.title} is already`,
      })
    }

    return body
  }
}
