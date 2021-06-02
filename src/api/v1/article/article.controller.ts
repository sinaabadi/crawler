import { Controller, Get, HttpStatus, Param, Query, UsePipes } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { StandardResponse } from '../../../helper/response/response.interface'
import { I18nService } from '../../../helper/i18n/i18n.service'
import { CrawlerService } from '../../../common/crawler/crawler.service'
import {
  ArticleGetAllArticlesQueryDto,
  ArticleGetAllArticlesQueryValidation,
} from './request-dto/get-all-articles.dto'
import { JoiValidationPipe } from '../../../pipes/joi-validation.pipe'
import { User } from '../../../helper/user/user.decorator'
import UserTokenPayload from '../../../helper/user/user-token-payload'
import {
  ArticleGetArticleDetailsParamDto,
  ArticleGetArticleDetailsParamValidation,
} from './request-dto/get-article-details.dto'
import { Auth } from '../../../helper/acl/auth.decorator'

@ApiTags('Article')
@Controller('/api/v1/articles')
export class ArticleController {
  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly i18n: I18nService,
  ) {
  }

  @Get('/:link')
  @ApiOperation({
    summary: 'Get specific article details',
    description: 'Get specific article details',
  })
  @UsePipes(new JoiValidationPipe({
    params: ArticleGetArticleDetailsParamValidation,
  }))
  @Auth()
  async getArticleDetails(
    @Param() param: ArticleGetArticleDetailsParamDto,
    @User() userToken: UserTokenPayload,
  ): Promise<StandardResponse> {
    const article = await this.crawlerService.getArticleByLink(param.link)
    if (!article) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: this.i18n.__('article_not_found'),
        payload: {},
      }
    }
    const details = await this.crawlerService.getArticleDetails(article)
    return {
      status: HttpStatus.OK,
      message: null,
      payload: {
        details,
      },
    }
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get articles from economist',
    description: 'Get articles from economist',
  })
  @UsePipes(new JoiValidationPipe({
    query: ArticleGetAllArticlesQueryValidation,
  }))
  async getArticles(
    @Query() query: ArticleGetAllArticlesQueryDto,
  ): Promise<StandardResponse> {
    const { articles, count } = await this.crawlerService.getArticles(query.page, query.size)
    return {
      status: HttpStatus.OK,
      message: null,
      payload: {
        articles,
        count
      },
    }
  }

}
