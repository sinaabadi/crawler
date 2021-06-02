import {ApiProperty} from '@nestjs/swagger'
import Joi from '../../../../helper/joi/joi'

export class ArticleGetArticleDetailsParamDto {
  @ApiProperty({required: true})
  readonly link: string = Joi.string().required()
}

export const ArticleGetArticleDetailsParamValidation
  = Joi.object(new ArticleGetArticleDetailsParamDto())


