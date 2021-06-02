import {ApiProperty} from '@nestjs/swagger'
import Joi from '../../../../helper/joi/joi'

export class ArticleGetAllArticlesQueryDto {
  @ApiProperty({required: true, default: 1})
  readonly page: number = Joi.number().min(1).default(1)
  @ApiProperty({required: true, default: 10})
  readonly size: number = Joi.number().min(1).default(10)
}

export const ArticleGetAllArticlesQueryValidation
  = Joi.object(new ArticleGetAllArticlesQueryDto())


