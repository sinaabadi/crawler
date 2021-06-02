import { Module } from '@nestjs/common'
import { CrawlerService } from './crawler.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ArticleSchema, ArticleSchemaName } from '../../models/article.schema'

@Module({
  providers: [CrawlerService],
  exports: [CrawlerService],
  imports: [
    MongooseModule.forFeature([
      {
        name: ArticleSchemaName,
        schema: ArticleSchema,
      },
    ]),
  ],
})
export class CrawlerModule {
}
