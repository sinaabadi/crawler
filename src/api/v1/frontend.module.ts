import { Module } from '@nestjs/common'
import { CrawlerModule } from '../../common/crawler/crawler.module'
import { ArticleController } from './article/article.controller'
import { AuthController } from './auth/auth.controller'
import { UserModule } from '../../common/user/user.module'

@Module({
  controllers: [ArticleController, AuthController],
  imports: [CrawlerModule, UserModule],
})
export class FrontendModule {
}
