import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import UserTokenPayload from './user-token-payload'

export const extractPayloadFromQuery = (token): UserTokenPayload => {
  return _.get(jwt.decode(token), 'payload')
}

export const extractPayloadFromHeaders = (headers): UserTokenPayload => {

  const { authorization } = headers
  const token = authorization.split(' ')[1]
  return _.get(jwt.decode(token), 'payload')
}
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return extractPayloadFromHeaders(request.headers)
  },
)
