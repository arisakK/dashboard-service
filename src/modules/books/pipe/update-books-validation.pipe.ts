import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

import { BooksService } from '../books.service'
import { UpdateBooksDto } from '../dto/update-books.dto'
import { BooksInterface } from '../interfaces/books.interface'

import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class UpdateBooksValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    UpdateBooksValidationPipe.name,
  )

  constructor(private readonly booksService: BooksService) {}

  async transform(body: UpdateBooksDto): Promise<UpdateBooksDto> {
    let book: BooksInterface
    try {
      book = await this.booksService.getByTitle(body.title)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (book) {
      this.logger.error(`catch on update: book title ${body.title} is already`)
      throw new BadRequestException({
        message: `book  title ${body.title} is already`,
      })
    }

    return body
  }
}
