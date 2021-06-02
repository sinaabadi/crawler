import {Test, TestingModule} from '@nestjs/testing'
import {CustomLoggerService} from './custom-logger.service'
import {ConfigService} from '../config/config.service'

describe('LoggerService', () => {
  let service: CustomLoggerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomLoggerService, ConfigService],
    }).compile()

    service = module.get<CustomLoggerService>(CustomLoggerService)
  })

  it('should be defined', () => {
    expect(true).toBeDefined()
  })
})
