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
import { UseRoles } from '../../decorators/role.decorator'
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard'
import EUserRoles from '../users/enum/user-roles.enum'

import { BooksStockService } from './books-stock.service'
import { AddBooksStockDto } from './dto/add-books-stock.dto'
import { AddQuantityBooksStockDto } from './dto/add-quantity-books-stock.dto'
import { BooksStockQueryDto } from './dto/books-stock-query.dto'
import { RunningOutQueryDto } from './dto/running-out-query.dto'
import { UsersOrderQueryDto } from './dto/users-order-query.dto'
import { UsersTopSaleQueryDto } from './dto/users-top-sale-query.dto'
import BooksStockQueryEntity from './entities/books-stock-query.entity'
import EGenre from './enum/genre.enum'
import { BooksStockInterface } from './interfaces/books-stock.interface'
import { AddBooksStockValidationPipe } from './pipe/add-books-stock-validation.pipe'
import { BooksStockValidationPipe } from './pipe/books-stock-validation.pipe'

import { JwtGuard } from '../auth/guards/jwt.guard'
import { LoggerService } from '../logger/logger.service'
import { UsersOrderInterface } from '../users-order/interfaces/users-order.interface'
import { UsersOrderService } from '../users-order/users-order.service'
import { BooksStockUtils } from '../utils/books-stock'
import { BooksUtil } from '../utils/books/index'
import { UserOrderUtil } from '../utils/user-order/index'

@Controller('books-stock')
@ApiTags('bookStock')
@ApiBearerAuth()
@UseGuards(JwtGuard, JwtRoleGuard)
export class BooksStockController {
  private readonly logger: LoggerService = new LoggerService(
    BooksStockController.name,
  )

  constructor(
    private readonly booksStockService: BooksStockService,
    private readonly userOrderService: UsersOrderService,
  ) {}

  @Get()
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BooksStockQueryEntity,
  })
  async getPagination(
    @Query() query: BooksStockQueryDto,
  ): Promise<BooksStockQueryEntity> {
    const { filter, kSort, title } = query

    query.sort = BooksUtil.sort(kSort) as Record<string, any>

    if (title) {
      filter.title = { $regex: `${title}` }
    }
    try {
      return await this.booksStockService.getPagination(query)
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Post()
  @UseRoles(EUserRoles.ADMIN)
  @ApiBody({
    type: AddBooksStockDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async addBookStock(
    @Body(AddBooksStockValidationPipe) body: AddBooksStockDto,
  ): Promise<void> {
    try {
      await this.booksStockService.addBookStock(body)
    } catch (e) {
      this.logger.error(
        `catch on addBookStock: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Put('add-quantity/:objectId')
  @ApiParam({
    type: String,
    name: 'objectId',
    description: 'objectId of BooksStock',
  })
  @ApiBody({
    type: AddQuantityBooksStockDto,
  })
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async addQuantity(
    @Param('objectId', BooksStockValidationPipe) stock: BooksStockInterface,
    @Body() body: AddQuantityBooksStockDto,
  ): Promise<void> {
    try {
      await this.booksStockService.addQuantity(stock, body.quantity)
    } catch (e) {
      this.logger.error(
        `catch on addQuantity: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('running-out')
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getRunningOut(
    @Query() query: RunningOutQueryDto,
  ): Promise<BooksStockQueryEntity> {
    const { min = 20, kSort } = query

    query.filter = {
      $and: [{ quantity: { $gt: 0 } }, { quantity: { $lt: min } }],
    }

    query.sort = BooksUtil.sort(kSort) as Record<string, any>

    try {
      return await this.booksStockService.getRunningOut(query)
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('top-sale')
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async reportTopSale(): Promise<any> {
    try {
      return this.userOrderService.topSeller()
    } catch (e) {
      this.logger.error(`catch on top-sale: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('top-sale-genre')
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getTopSaleByGenre(): Promise<any> {
    let order: UsersOrderInterface[]
    try {
      order = await this.userOrderService.topSellerByGenre()

      return BooksStockUtils.getTopSellerGenre(EGenre, order)
    } catch (e) {
      this.logger.error(
        `catch on reportByCategory: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('topSale-userOrder')
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getUserTopSale(@Query() query: UsersTopSaleQueryDto): Promise<any> {
    try {
      return this.userOrderService.getTopUserBought(query)
    } catch (e) {
      this.logger.error(`catch on top-sale: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('userOrder')
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getUsersOrder(@Query() query: UsersOrderQueryDto): Promise<any> {
    try {
      return this.userOrderService.getUsersOrder(query)
    } catch (e) {
      this.logger.error(
        `catch on getUsersOrder: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('get-week-day')
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getWeekDay() {
    try {
      const orderWeeks = await this.userOrderService.getReportByWeek()

      return UserOrderUtil.getWeekDay(orderWeeks)
    } catch (e) {
      this.logger.error(
        `catch on getUserOrder: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}
