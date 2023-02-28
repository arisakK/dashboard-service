import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

import { BooksService } from '../books.service'
import { BooksInterface } from '../interfaces/books.interface'

import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class BooksValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    BooksValidationPipe.name,
  )

  constructor(private readonly booksService: BooksService) {}

  async transform(objectId: string): Promise<BooksInterface> {
    let book: BooksInterface
    try {
      book = await this.booksService.getByObjectId(objectId)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (!book) {
      this.logger.error(`catch on book: book ${objectId} not found`)
      throw new BadRequestException({
        message: `${objectId} not found`,
      })
    }

    return book
  }
}
