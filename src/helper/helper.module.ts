import {Global, Module} from '@nestjs/common'
import {HelperService} from './helper.service'
import {ResponseService} from './response/response.service'
import {I18nService} from './i18n/i18n.service'
import {ErrorService} from './error/error.service'

@Global()
@Module({
  providers: [HelperService, ResponseService, I18nService, ErrorService],
  exports: [HelperService, ResponseService, I18nService, ErrorService],
})
export class HelperModule {
}
