import {
  Body,
  Controller,
  Delete,
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
import { JwtRoleGuard } from '../auth/guards/jwt-role.guard'

import { BuyBookDto } from './dto/buy-book.dto'
import { UsersChangePasswordDto } from './dto/users-change-password.dto'
import { UsersHistoryQueryDto } from './dto/users-history-query.dto'
import { UsersSignUpDto } from './dto/users-sign-up.dto'
import { UsersUpdateStatusDto } from './dto/users-update-status.dto'
import { UsersUpdateDto } from './dto/users-update.dto'
import { UserValidationPipe } from './pipe/users-validation.pipe'
import { UsersService } from './users.service'
import { UsersEntity } from './entities/users.entity'
import { UsersChangePasswordValidationPipe } from './pipe/users-change-password-validation.pipe'
import EUserRoles from './enum/user-roles.enum'
import { UsersInterface } from './interface/users.interface'
import { BuyBooksValidationPipe } from './pipe/buy-books-validation.pipe'

import { JwtGuard } from '../auth/guards/jwt.guard'
import { BooksStockService } from '../books-stock/books-stock.service'
import { LoggerService } from '../logger/logger.service'
import { UsersOrderService } from '../users-order/users-order.service'
import { UserOrderUtil } from '../utils/user-order/index'
import usersOrderHistoryQueryEntity from '../users-order/entities/users-order-history-query.entity'

import UsePermissions from '../../decorators/permissions.decorator'
import ReqUser from '../../decorators/req-user.decorator'
import { UseRoles } from '../../decorators/role.decorator'

@Controller('users')
@ApiTags('users')
export class UsersController {
  private readonly logger: LoggerService = new LoggerService(
    UsersController.name,
  )

  constructor(
    private readonly booksStockService: BooksStockService,
    private readonly usersService: UsersService,
    private readonly usersOrderService: UsersOrderService,
  ) {}

  @Get('Me')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UsersEntity,
  })
  async getMe(@ReqUser() user: UsersInterface): Promise<UsersEntity> {
    return user
  }

  @Post()
  @ApiBody({
    type: UsersSignUpDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async signUp(@Body() body: UsersSignUpDto): Promise<void> {
    try {
      await this.usersService.signUp(body)
    } catch (e) {
      this.logger.error(`catch on update: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Put('update')
  @ApiBody({
    type: UsersUpdateDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async userUpdate(
    @ReqUser() user: UsersInterface,
    @Body() update: UsersUpdateDto,
  ): Promise<void> {
    try {
      await this.usersService.update(user.objectId, update)
    } catch (e) {
      this.logger.error(`catch on update: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Put('change-password')
  @ApiBody({
    type: UsersChangePasswordDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, JwtRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async changePassword(
    @ReqUser() user: UsersInterface,
    @Body(UsersChangePasswordValidationPipe) body: UsersChangePasswordDto,
  ): Promise<void> {
    try {
      await this.usersService.changePassword(user.objectId, body.hashPassword)
    } catch (e) {
      this.logger.error(
        `catch on changePassword: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Post('buy-book')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, JwtRoleGuard)
  @UseRoles(EUserRoles.USER, EUserRoles.ADMIN)
  @UsePermissions('ACTIVE')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async buyBooks(
    @Body(BuyBooksValidationPipe) body: BuyBookDto,
    @ReqUser() user: UsersInterface,
  ): Promise<void> {
    const { book, bookStock, quantity } = body
    try {
      await this.usersOrderService.createOrder({
        userId: user.objectId,
        bookStockId: bookStock.objectId,
        quantity: body.quantity,
        totalPrice: book.price * body.quantity,
        includingVat: UserOrderUtil.includingVat(book.price * body.quantity),
      })
    } catch (e) {
      this.logger.error(
        `catch on buyBook-userOrder: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }

    try {
      await this.booksStockService.updateStock(body.bookStock.objectId, {
        quantity: bookStock.quantity - quantity,
        quantityBought: bookStock.quantityBought + quantity,
        totalOrder: bookStock.totalOrder + 1,
      })
    } catch (e) {
      this.logger.error(`catch on buy-book: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('history')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, JwtRoleGuard)
  @UseRoles(EUserRoles.USER, EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: usersOrderHistoryQueryEntity,
  })
  async getHistoryByOrder(
    @ReqUser() user: UsersInterface,
    @Query() query: UsersHistoryQueryDto,
  ): Promise<usersOrderHistoryQueryEntity> {
    try {
      return this.usersOrderService.getHistoryByOrder(user.objectId, query)
    } catch (e) {
      this.logger.error(`catch on history: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }

    // return data.reduce(
    //   (p, c) => ({
    //     ...p,
    //     [c.book.genre]: {
    //       quantity: p[c.book.genre]?.quantity + c.quantity || c.quantity,
    //       total: p[c.book.genre]?.total + c.total || c.total,
    //     },
    //   }),
    //   {},
    // )
  }

  @Post('update-status/:objectId')
  @ApiParam({
    type: String,
    name: 'objectId',
  })
  @UseGuards(JwtGuard, JwtRoleGuard)
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async updateStatus(
    @Param('objectId', UserValidationPipe) user: UsersInterface,
    @Body() body: UsersUpdateStatusDto,
  ): Promise<void> {
    try {
      await this.usersService.updateStatus(user.objectId, body.status)
    } catch (e) {
      this.logger.error(`catch on delete: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Delete(':objectId')
  @ApiParam({
    type: String,
    name: 'objectId',
  })
  @UseGuards(JwtGuard, JwtRoleGuard)
  @UseRoles(EUserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async userDelete(
    @Param('objectId', UserValidationPipe) user: UsersInterface,
  ): Promise<void> {
    try {
      await this.usersService.delete(user.objectId)
    } catch (e) {
      this.logger.error(`catch on delete: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}
