import {Request} from 'express'

export interface StandardResponse {
  status: number,
  message: string,
  payload: object,
  requestId?: string
}

export interface ExtendedRequest extends Request {
  requestId: string
}
