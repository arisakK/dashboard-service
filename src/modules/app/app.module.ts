import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import { AuthModule } from '../auth/auth.module'
import { BooksStockModule } from '../books-stock/books-stock.module'
import { BooksModule } from '../books/books.module'
import { UsersOrderModule } from '../users-order/users-order.module'
import { UsersModule } from '../users/users.module'

import RegisterCacheOptions from '../../cache.providers'
import configuration from '../../config/configuration'
import {
  throttlerAsyncOptions,
  throttlerServiceProvider,
} from '../../throttler.providers'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CacheModule.registerAsync(RegisterCacheOptions),
    ThrottlerModule.forRootAsync(throttlerAsyncOptions),
    AuthModule.register(),
    BooksModule.register(),
    BooksStockModule.register(),
    UsersModule.register(),
    UsersOrderModule.register(),
  ],
  providers: [throttlerServiceProvider],
})
export class AppModule {}
