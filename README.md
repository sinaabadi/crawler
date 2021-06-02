# Crawler

## Description
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Volumes
Please mount assets directory to keep all assets and uploaded files.

# Directory structure inside src
# assets
All uploaded files are stored here.

## api/v1
All frontend controller with their DTOs and validations must be stored in
these directories.

## common
This directory keep all common service and module that you need
among different API versions and store all business logic

## models
This directory holds all of our application database models.
## config
All project config goes here.

## constants
Project wide constants are stored here. please note all module constants stored beside it's files.

## filters
All project wide filters goes here. http exception filter are already initialized here and catch and format and log all
exception.

## pipes
All project wide pipes goes here. joi validation pip are already implemented. we use it before each route as follows:
```js
  @UsePipes(
    new JoiValidationPipe({
      params: SomeValidation,
      body: OtherValidation,
      query: QueryValidation
    })
```
And in DTO section we have this:

```js
export const SomeValidation = Joi.object(
  new SomeValidationDto()
)
```
SomeValidationDto:
```js
export class SomeValidationDto {
  @ApiProperty({ format: '...' })
  readonly name: string = Joi.string().required()
}
```

# Modules
## Config Module
Store and get all of project config. you can customise your config based on running environment.
for usage please see [Config Repo](https://www.npmjs.com/package/config).
this module only export single **get** method and are available as global module.
you can also create `local.json` file in config directory to have all of your local dev configs.

## Helper Module
Store all helper function in this module

### Joi
We use joi as our validation library. this helper will be used in Joi validation pipe

### JWT Service and middleware
Handle all jwt parsing logic.

### Response Interceptor and Interface
For sake of simplicity we add response interceptor that format response and errors that thrown inside application. you
just return `Standard Response` and you are ready to go.
```js
export interface StandardResponse {
  status: number,
  message: string,
  payload: object,
  requestId?: string
}
```
We use it in controller as follows:
```js
  @Get()
  async getHello(): Promise<StandardResponse> {
    return {
      message: 'Hi :)',
      payload: {},
      status: HttpStatus.OK,
    }
  }
```

### Rest Client Service
Handle all rest api call.

## Logger Module
Has a global middleware that assign request `uuid v4 token`  property `requestId` to each request.
we use `winston` logger. for logging into elastic search we declare `ELKMeta` interface that all
index fields must declared in index property and all raw data must be placed in raw property.
Please look at `custom-logger.service.ts` and `logger.interceptor.ts`


# API Docs
`Swagger API doc` for api documentation are enabled by default

# MongoDB
mongoDB driver and mongoose are already configured and you can use enable it
in `src/app/app.module.ts`. just change address in config file and you are ready to go. for more information please [see this link](https://docs.nestjs.com/techniques/mongodb)
**Please Note** that if you want to disable it you should remove it from app module and app-health service inside app module

# RabbitMQ
RabbitMQ module are already configured for you as global module. there are two function exported:
1 - `dispatch<RoutingKey extends keyof ActionTypes>(actionTypes: RoutingKey, content: ActionTypes[RoutingKey], requestId: string)`
2 - `createAndBindQueueToExchange(queue: string, pattern: keyof ConsumerPatterns, consumer)`
to disable this module just comment this module in app module
`dispatch` will dispatch new event. please note that you must add your action type and routing key to this module.
`createAndBindQueueToExchange` will create new queue and consume based on provided routing key.

 # Health Check
 A Health Check API are already declared in following address: `{ROOT_ADDRESS}/health` and check these services:

 - DNS (ping)
 - Mongo (ping)
 - Ram (Threshold)
