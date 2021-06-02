import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import  _ from 'lodash'
import  jwt from 'jsonwebtoken'
import { UserService } from '../../common/user/user.service'
import { extractPayloadFromHeaders, extractPayloadFromQuery } from '../user/user.decorator'
import { I18nService } from '../i18n/i18n.service'
import { ExtendedError } from '../error/error.service'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly invalidTokenMessage: string
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService
  ) {
    this.invalidTokenMessage = this.i18n.__('token.invalid')
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const {token} = req.query
    token ? this.checkQueryToken(token) : this.checkHeaderToken(req.headers.authorization)
    const tokenPayload = token ? extractPayloadFromQuery(token) : extractPayloadFromHeaders(req.headers)
    const user = await this.userService.getUserDetails(tokenPayload.userId)
    if (!user) {
      throw new ExtendedError(
        HttpStatus.NOT_FOUND,
        this.i18n.__('user.not_found'),
        {}
      )
    }
    return true
  }

  private checkQueryToken(token) {
    if (!token) {
      throw new ExtendedError(
        HttpStatus.UNAUTHORIZED,
        this.invalidTokenMessage,
        {}
      )
    }
    const payload = _.get(jwt.decode(token), 'payload')
    if (!payload) {
      throw new ExtendedError(
        HttpStatus.UNAUTHORIZED,
        this.invalidTokenMessage,
        {}
      )
    }
  }

  private checkHeaderToken(authorization) {
    if (!authorization) {
      throw new ExtendedError(
        HttpStatus.UNAUTHORIZED,
        this.invalidTokenMessage,
        {}
      )
    }
    const token = authorization.split(' ')[1]
    if (!token) {
      throw new ExtendedError(
        HttpStatus.UNAUTHORIZED,
        this.invalidTokenMessage,
        {}
      )
    }
    const payload = _.get(jwt.decode(token), 'payload')
    if (!payload) {
      throw new ExtendedError(
        HttpStatus.UNAUTHORIZED,
        this.invalidTokenMessage,
        {}
      )
    }
  }
}
