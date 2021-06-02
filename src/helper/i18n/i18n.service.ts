import {Injectable} from '@nestjs/common'
import  i18n from 'i18n'

declare const __: any

@Injectable()
export class I18nService {
  constructor() {
    i18n.configure({
      locales: ['en'],
      defaultLocale: 'en',
      directory: 'locales',
      objectNotation: true
    })
  }

  __(phrase) {
    return i18n.__(phrase)
  }
}
