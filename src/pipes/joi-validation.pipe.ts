import {ArgumentMetadata, HttpStatus, Injectable, PipeTransform} from '@nestjs/common'
import {ExtendedError} from '../helper/error/error.service'
import  i18n from 'i18n'
import { I18nService } from '../helper/i18n/i18n.service';

interface ValidationObject {
  body?: object,
  params?: object,
  query?: object
}

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(
    private readonly schema: ValidationObject,
    private readonly allowUnknown = false
  ) {
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const schema = this.getSchema(metadata)
    if (!schema) {
      return value
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const {error, value: newValue} = schema.validate(value)
    if (error) {
      throw new ExtendedError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        i18n.__('input.invalid'),
        this.formatError(error.details),
      )
    }
    return newValue
  }

  getSchema(meta: ArgumentMetadata) {
    switch (meta.type) {
    case 'body':
      return this.schema.body
    case 'param':
      return this.schema.params
    case 'query':
      return this.schema.query
    default:
      return null
    }
  }

  formatError(errors) {
    const usefulErrors = {}
    errors.forEach(error => {
      if (!usefulErrors.hasOwnProperty(error.path.join('.'))) {
        usefulErrors[error.path.join('.')] = error.message
      }
    })
    return usefulErrors
  }
}
