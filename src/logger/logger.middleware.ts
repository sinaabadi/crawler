import {NestMiddleware} from '@nestjs/common'
import {v4 as uuidV4} from 'uuid'
import {Request, Response} from 'express'

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): any {
    Object.assign(req, {requestId: uuidV4()})
    next()
  }

}
