import { createLogger, format, Logger as winstoneLogger, transports } from 'winston'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import _ from 'lodash'

export interface ELKMeta {
  raw?: string | object,
  index?: ElkIndex
}

export interface ElkIndex {
  context: string,
  requestId?: string

  [otherFields: string]: any
}

export enum Levels {
  info = 'info',
  warn = 'warn',
  error = 'error',
  verbose = 'verbose',
  debug = 'debug'
}

@Injectable()
export class CustomLoggerService {

  private readonly winston: winstoneLogger;

  constructor(
    private readonly config: ConfigService,
  ) {

    this.winston = createLogger({
      format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
      defaultMeta: { service: config.get('serviceId') },
      transports: [
        new transports.Console(),
      ],
    })
  }

  getLevels() {
    return Levels
  }

  debug(message: any, context?: string): void {
    this.logWithMeta(message, { raw: context }, Levels.debug)
  }

  verbose(message: any, context?: string): void {
    this.logWithMeta(message, { raw: context }, Levels.verbose)
  }

  error(message: string, trace: string) {
    this.logWithMeta(message, { raw: trace }, Levels.error)
  }

  log(message: string) {
    this.logWithMeta(message, null, Levels.info)
  }

  warn(message: string) {
    this.logWithMeta(message, null, Levels.warn)
  }

  logWithMeta(message: string, meta?: ELKMeta, level?: Levels) {
    const rawData = _.get(meta, 'raw', null)
    this.winston
      .child({
        ...meta,
        service: this.config.get('serviceId'),
        raw: rawData && typeof rawData === 'object' ? JSON.stringify(rawData) : rawData,
      })
      .log(level || 'info', message)
  }

  info(message: string) {
    this.logWithMeta(message)
  }
}
