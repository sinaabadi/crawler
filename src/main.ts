import {NestFactory} from '@nestjs/core'
import {AppModule} from './app/app.module'
import  config from 'config'
import {CustomLoggerService} from './logger/custom-logger.service'
import {NestExpressApplication} from '@nestjs/platform-express'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import  helmet from 'helmet'
import  compression from 'compression'
import basicAuth from 'express-basic-auth'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  })
  app.use(helmet())
  app.use(compression())
  app.set('etag', false)
  app.useLogger(app.get(CustomLoggerService))
  const docsPath = '/swagger'
  app.use(docsPath, basicAuth({
    challenge: true,
    users: { admin: config.get<string>('swagger.adminPassword') },
  }))
  const swaggerVersion = config.get<string>('swagger.version')
  const swaggerTitle = config.get<string>('swagger.title')
  const swaggerDescription = config.get<string>('swagger.description')
  const swaggerBaseUrl = config.get<string>('swagger.baseUrl')
  const options = new DocumentBuilder()
    .setDescription(swaggerDescription)
    .setTitle(swaggerTitle)
    .setVersion(swaggerVersion)
    .addBearerAuth()

  if (swaggerBaseUrl) {
    options.addServer(swaggerBaseUrl)
  }
  const document = SwaggerModule.createDocument(app, options.build())
  SwaggerModule.setup('swagger', app, document)
  await app.listen(config.get<number>('port'))
}

bootstrap()
