import {Injectable} from '@nestjs/common'
import  config from 'config'

@Injectable()
export class ConfigService {
  get(key: string): any {
    return config.get(key)
  }
}
