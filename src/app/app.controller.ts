import {Controller, Get, HttpStatus} from '@nestjs/common'
import {AppService} from './app.service'
import {StandardResponse} from '../helper/response/response.interface'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  async getHello(): Promise<StandardResponse> {
    return {
      message: 'Hi :)',
      payload: {},
      status: HttpStatus.OK,
    }
  }
}
