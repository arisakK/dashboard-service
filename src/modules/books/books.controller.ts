import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { BooksService } from './books.service'
import { BooksQueryDto } from './dto/books-query.dto'
import { CreateBooksDto } from './dto/create-books.dto'
import { CreateInBooksStockDto } from './dto/create-in-books-stock.dto'
import { UpdateBooksDto } from './dto/update-books.dto'
import BooksQueryEntity from './entities/books-query.entity'
import BooksEntity from './entities/books.entity'
import { BooksInterface } from './interfaces/books.interface'
import { BooksValidationPipe } from './pipe/books-validation.pipe'
import { CreateBooksValidationPipe } from './pipe/create-books-validation.pipe'
import { CreateInBooksStockValidationPipe } from './pipe/create-in-books-stock-validation.pipe'

import { JwtRoleGuard } from '../auth/guards/jwt-role.guard'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { LoggerService } from '../logger/logger.service'
import EUserRoles from '../users/enum/user-roles.enum'
import { BooksUtil } from '../utils/books/index'

import { UseRoles } from '../../decorators/role.decorator'
import { UpdateBooksValidationPipe } from './pipe/update-books-validation.pipe'

@Controller('books')
@ApiTags('books')
@ApiBearerAuth()
@UseGuards(JwtGuard, JwtRoleGuard)
export class BooksController {
  private readonly logger: LoggerService = new LoggerService(
    BooksController.name,
  )

  constructor(private readonly booksService: BooksService) {}

  @Get()
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BooksQueryEntity,
  })
  async getPagination(
    @Query() query: BooksQueryDto,
  ): Promise<BooksQueryEntity> {
    const { genre, kSort, title } = query

    query.filter = BooksUtil.getQueryByCategory(genre)

    query.sort = BooksUtil.sort(kSort)

    if (title) {
      query.filter = { ...query.filter, title: { $regex: `${title}` } }
    }

    try {
      return this.booksService.getPagination(query)
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get(':objectId')
  @ApiParam({
    type: String,
    name: 'objectId',
  })
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BooksEntity,
  })
  async getByObjectId(
    @Param('objectId', BooksValidationPipe) book: BooksInterface,
  ): Promise<BooksEntity> {
    return book
  }

  @Post('create')
  @ApiBody({
    type: CreateBooksDto,
  })
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async createBooks(
    @Body(CreateBooksValidationPipe) body: CreateBooksDto,
  ): Promise<void> {
    try {
      await this.booksService.create(body)
    } catch (e) {
      this.logger.error(`catch on addBooks: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Post('create-in-stock')
  @ApiBody({
    type: CreateInBooksStockDto,
  })
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async createInStock(
    @Body(CreateInBooksStockValidationPipe) body: CreateInBooksStockDto,
  ): Promise<void> {
    try {
      await this.booksService.createInStock(body)
    } catch (e) {
      this.logger.error(
        `catch on createInStock: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Put('update/:objectId')
  @ApiParam({
    type: String,
    name: 'objectId',
  })
  @UseRoles(EUserRoles.ADMIN)
  @ApiBody({
    type: UpdateBooksDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async updateBook(
    @Param('objectId', BooksValidationPipe) book: BooksInterface,
    @Body(UpdateBooksValidationPipe) body: UpdateBooksDto,
  ): Promise<void> {
    try {
      await this.booksService.update(book.objectId, body)
    } catch (e) {
      this.logger.error(
        `catch on updateBook: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: `${e?.message ?? e}`,
      })
    }
  }
}
