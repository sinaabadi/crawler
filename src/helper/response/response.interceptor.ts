import {CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor} from '@nestjs/common'
import {Observable} from 'rxjs'
import {ExtendedRequest, StandardResponse} from './response.interface'
import {catchError, map} from 'rxjs/operators'
import {Request, Response} from 'express'
import {ConfigService} from '../../config/config.service'
import {CustomLoggerService} from '../../logger/custom-logger.service'
import {NodeEnv} from '../../constants/env'
import  _ from 'lodash'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<ExtendedRequest>()
    const res = context.switchToHttp().getResponse<Response>()
    return next.handle()
      .pipe(
        map(this.formatResponse(req.method, res, req.requestId)),
        catchError(this.formatError(res, req)),
      )
  }

  formatError(res: Response, req: Request) {
    return async (
      err: any,
      caught: Observable<any>,
    ): Promise<StandardResponse> => {
      const {requestId, query, body, params, headers, originalUrl, url, path, method} = req as any
      const env = this.config.get('nodeEnv')
      const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR
      const message = env === NodeEnv.production && status >= 500
        ? 'Internal Server Error'
        : _.get(err, 'message.message', err.message || null)
      const payload = {
        ...(env !== NodeEnv.production && status > 403 && {
          error: err.stack || err.message || err,
        }),
      }
      res.statusCode = status
      this.logger.logWithMeta(err.message, {
        index: {
          error: err.message,
          context: 'formatError',
          status,
          path,
          originalUrl,
          url,
          requestId,
          method,
          headers,
        },
        raw: {
          query,
          body,
          params,
          error: err,
        },
      }, this.logger.getLevels().error)
      if (typeof err === 'object' && ['status', 'message', 'payload'].some(key => !(key in err))) {
        return {
          status,
          message,
          payload,
          requestId,
        }
      }
      return {..._.pick(err, ['status', 'message', 'payload']), requestId}
    }
  }

  formatResponse(method: string, res: Response, requestId: string) {
    return (response): StandardResponse => {
      if (!response) {
        return
      }
      const status = response.status ? response.status : method === 'POST' ? HttpStatus.CREATED : HttpStatus.OK
      const message = method === 'POST' ? 'Resource Created' : 'OK'
      res.statusCode = status
      if (typeof response === 'object' && ['status', 'message', 'payload'].some(key => !(key in response))) {
        return {
          status,
          message,
          payload: response,
        }
      }
      return {
        ...response,
        requestId,
      }
    }
  }
}
