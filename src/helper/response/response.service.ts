import {HttpStatus, Injectable} from '@nestjs/common'
import {ConfigService} from '../../config/config.service'
import {NodeEnv} from '../../constants/env'
import {StandardResponse} from './response.interface'
import  _ from 'lodash'

@Injectable()
export class ResponseService {
  constructor(
    private readonly config: ConfigService,
  ) {
  }

  format(status: HttpStatus, message: string | null, payload: object | null) {
    return {
      status: status || HttpStatus.OK,
      message: message || null,
      payload: payload || {},
    }
  }

  formatException(message: string, statusCode: HttpStatus, trace: string): StandardResponse {
    const env = this.config.get('nodeEnv')
    const status = statusCode || HttpStatus.INTERNAL_SERVER_ERROR
    return {
      status,
      message: _.get(message, 'message', message || null),
      payload: {
        error: {
          message: _.get(message, 'message', message || null),
          ...((env !== NodeEnv.production && status >= HttpStatus.INTERNAL_SERVER_ERROR) && {trace}),
        },
      },
    }
  }
}
