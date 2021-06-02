import {Injectable} from '@nestjs/common'

export class ExtendedError extends Error {
  private readonly status
  private readonly payload

  constructor(status: number, message: string, payload: object) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

@Injectable()
export class ErrorService {
  createCustomError(status: number, message: string, payload: object) {
    return new ExtendedError(status, message, payload)
  }
}
