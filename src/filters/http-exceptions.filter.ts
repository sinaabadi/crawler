import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from '@nestjs/common'
import {Response} from 'express'
import {ResponseService} from '../helper/response/response.service'
import {CustomLoggerService} from '../logger/custom-logger.service'
import {StandardResponse} from '../helper/response/response.interface'
import {I18nService} from '../helper/i18n/i18n.service'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly responseHelper: ResponseService,
    private readonly logger: CustomLoggerService,
    private readonly i18n: I18nService,
  ) {
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const {
      message,
      status,
      stack,
    } = exception as any
    const overwriteMessage = status === HttpStatus.FORBIDDEN ? this.i18n.__('forbidden_access') : message
    const resBody: StandardResponse = this.responseHelper.formatException(overwriteMessage, status, stack)
    this.logger.logWithMeta(message, {
      index: {
        context: 'http-exception-filter',
      },
      raw: resBody,
    })
    response
      .status(resBody.status)
      .json(resBody)
  }
}
