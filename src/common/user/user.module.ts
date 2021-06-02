import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema, UserSchemaName } from '../../models/user.schema'

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchemaName,
        schema: UserSchema,
      },
    ]),
  ],
})
export class UserModule {
}
