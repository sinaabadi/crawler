import { Injectable } from '@nestjs/common'
import { ConfigService } from '../../config/config.service'
import { CustomLoggerService } from '../../logger/custom-logger.service'
import Sitemapper from 'sitemapper'
import { InjectModel } from '@nestjs/mongoose'
import { ArticleModel, ArticleSchemaName, Providers } from '../../models/article.schema'
import got from 'got'
import cheerio from 'cheerio'

@Injectable()

export class CrawlerService {
  #sitemap;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: CustomLoggerService,
    @InjectModel(ArticleSchemaName)
    private readonly articleModel: ArticleModel,
  ) {
    this.#sitemap = new Sitemapper({
      url: this.config.get('sites.economist'),
      timeout: 15000,
    })

    this.startCrawler()
  }

  async getArticlesFromSiteMap(): Promise<string[]> {
    const sitemapResult = await this.#sitemap.fetch()
    return sitemapResult?.sites || []
  }

  async getArticles(page: number, size: number): Promise<any> {
    const [articles, count] = await Promise.all([
      this.articleModel.getList(page, size),
      this.articleModel.countAll()
    ])
    return {articles, count}
  }

  async getArticleDetails(article: ArticleModel) {
    if (article.body) {
      return {
        title: article.title,
        body:  article.body,
      }
    }
    const link = article.link
    const formattedBody = []
    const res = await got(link)
    const $ = cheerio.load(res.body)
    // @ts-ignore
    const title = $('title')?.[0]?.children[0].data
    const body = $('p.article__body-text').each(function(i, elm) {
      // @ts-ignore
      formattedBody.push(elm.children?.[0]?.data)
    })

    await this.articleModel.updateOne({ link }, { $set: { body: formattedBody.join('\n'), title } })
    return {
      title,
      body: formattedBody.join('\n'),
    }
  }

  async getArticleByLink(link: string) {
    return this.articleModel.findOne({ link })
  }

  private startCrawler() {
    setInterval(async () => {
      const articles = await this.getArticlesFromSiteMap()
      if (articles.length === 0) {
        return null
      }
      const bulk = this.articleModel.collection.initializeUnorderedBulkOp()
      for (const article of articles) {
        bulk.find({
          link: article,
        }).upsert().updateOne({
          $set: {
            link: article,
            provider: Providers.Economist,
            title: article.split('/').pop().replace(/-/g, ' '),
          },
        })
      }
      bulk.execute()
    }, this.config.get('updateInterval'))
  }
}
