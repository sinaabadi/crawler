import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '../config/config.module'
import { HelperModule } from '../helper/helper.module'
import { LoggerModule } from '../logger/logger.module'
import { LoggerMiddleware } from '../logger/logger.middleware'
import { LoggerInterceptor } from '../logger/logger.interceptor'
import { HttpExceptionFilter } from '../filters/http-exceptions.filter'
import { ResponseInterceptor } from '../helper/response/response.interceptor'
import { AppHealthService } from './app-health/app-health.service'
import { TerminusModule } from '@nestjs/terminus'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { FrontendModule } from '../api/v1/frontend.module'
import { CrawlerModule } from '../common/crawler/crawler.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigService } from '../config/config.service'
import { UserModule } from '../common/user/user.module'

@Module({
  imports: [
    ConfigModule,
    HelperModule,
    LoggerModule,
    CrawlerModule,
    FrontendModule,
    UserModule,
    TerminusModule.forRootAsync({
      useClass: AppHealthService,
    }),
    MongooseModule.forRootAsync({
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      imports: [AppModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('mongo.url'),
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // Global Filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }

}
