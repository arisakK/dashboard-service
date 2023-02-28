import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, Observable } from 'rxjs'

import { UsersSignUpDto } from './dto/users-sign-up.dto'
import { UsersUpdateDto } from './dto/users-update.dto'
import { UsersStatusEnum } from './enum/users-status.enum'
import { UsersInterface } from './interface/users.interface'

import { RMQService, USERS } from '../../microservice.constants'
import { UsersSignInEntity } from '../auth/entities/users-sign-in.entity'

@Injectable()
export class UsersService {
  @Inject(RMQService.Users) private readonly userService: ClientProxy

  async signIn(user: UsersInterface): Promise<UsersSignInEntity> {
    return lastValueFrom(
      this.userService.send(
        {
          cmd: USERS,
          method: 'sign-in',
        },
        {
          objectId: user.objectId,
          username: user.username,
        },
      ),
    )
  }

  signUp(body: UsersSignUpDto): Observable<any> {
    return this.userService.emit(
      {
        cmd: USERS,
        method: 'create',
      },
      body,
    )
  }

  async getByObjectId(objectId: string): Promise<UsersInterface> {
    return lastValueFrom(
      this.userService.send(
        {
          cmd: USERS,
          method: 'getByObjectId',
        },
        objectId,
      ),
    )
  }

  async getByUsername(username: string): Promise<UsersInterface> {
    return lastValueFrom(
      this.userService.send(
        {
          cmd: USERS,
          method: 'getByUsername',
        },
        username,
      ),
    )
  }

  update(objectId: string, update: UsersUpdateDto): Observable<any> {
    return this.userService.emit(
      {
        cmd: USERS,
        method: 'update',
      },
      {
        objectId,
        update,
      },
    )
  }

  delete(objectId: string): Observable<any> {
    return this.userService.emit(
      {
        cmd: USERS,
        method: 'delete',
      },

      objectId,
    )
  }

  updateStatus(objectId: string, status: UsersStatusEnum): Observable<any> {
    return this.userService.emit(
      {
        cmd: USERS,
        method: 'update-status',
      },
      {
        objectId,
        status,
      },
    )
  }

  changePassword(objectId: string, hashPassword: string): Observable<any> {
    return this.userService.emit(
      {
        cmd: USERS,
        method: 'change-password',
      },
      {
        objectId,
        hashPassword,
      },
    )
  }
}
