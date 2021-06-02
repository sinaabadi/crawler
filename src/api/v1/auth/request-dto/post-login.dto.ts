import {ApiProperty} from '@nestjs/swagger'
import Joi from '../../../../helper/joi/joi'

export class AuthPostLoginUserDto {
  @ApiProperty({required: true})
  readonly email: string = Joi.string().email().required()
  @ApiProperty({required: true})
  readonly password: string = Joi.string().min(8).required()
}

export const AuthPostLoginUserValidation
  = Joi.object(new AuthPostLoginUserDto())


