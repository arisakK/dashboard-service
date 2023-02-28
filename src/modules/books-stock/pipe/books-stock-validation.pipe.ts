import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

import { BooksStockService } from '../books-stock.service'
import { BooksStockInterface } from '../interfaces/books-stock.interface'

import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class BooksStockValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    BooksStockValidationPipe.name,
  )

  constructor(private readonly booksStockService: BooksStockService) {}

  async transform(objectId: string): Promise<BooksStockInterface> {
    let stock: BooksStockInterface
    try {
      stock = await this.booksStockService.getByObjectId(objectId)
    } catch (e) {
      this.logger.error(`catch on books: ${e?.message ?? JSON.stringify(e)}`)
      throw new BadRequestException({
        message: `${e?.message ?? e}`,
      })
    }
    if (!stock) {
      this.logger.error(`catch on stock: stock ${objectId} not found`)
      throw new BadRequestException({
        message: `${objectId} not found`,
      })
    }

    return stock
  }
}
