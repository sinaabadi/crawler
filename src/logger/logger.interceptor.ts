import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common'
import {Observable} from 'rxjs'
import {tap} from 'rxjs/operators'
import {CustomLoggerService} from './custom-logger.service'
import  moment from 'moment'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    readonly logger: CustomLoggerService
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    this.logger.logWithMeta('New Request', {
      index: {
        path: req.path,
        url: req.originalUrl,
        requestId: req.requestId,
        headers: req.headers,
        context: 'logger-interceptor'
      },
      raw: {
        body: req.body,
        params: req.params,
        query: req.query,
      }
    })
    const startAt = moment()
    return next.handle().pipe(
      tap(() => this.logger.logWithMeta('Request End', {
        index: {
          path: req.path,
          originalUrl: req.originalUrl,
          url: req.url,
          requestId: req.requestId,
          method: req.method,
          headers: req.headers,
          executionTimeMs: moment().diff(startAt, 'milliseconds'),
          context: 'logger-interceptor'
        },
        raw: {
          body: req.body,
          params: req.params,
          query: req.query,
        }
      }))
    )
  }
}
