import { Injectable } from '@nestjs/common'
import { ConfigService } from '../../config/config.service'
import { CustomLoggerService } from '../../logger/custom-logger.service'
import { InjectModel } from '@nestjs/mongoose'
import { UserModel, UserSchemaName } from '../../models/user.schema'
import crypto from 'crypto'
import { sign } from 'jsonwebtoken'

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: CustomLoggerService,
    @InjectModel(UserSchemaName)
    private readonly userModel: UserModel,
  ) {
  }

  async signup(email: string, password: string) {
    const hashedPassword = this.hashString(password)
    await this.userModel.createNewUser({email, password: hashedPassword})
  }

  async isValidUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email })
    if (!user) {
      return false
    }
    const hashedPassword = this.hashString(password)
    if (hashedPassword !== user.password) {
      return false
    }
    return user
  }

  async getUserDetails(userId: string) {
    return this.userModel.findOne({ _id: userId })
  }

  async findUserByEmail(email: string){
    return this.userModel.findOne({email})
  }
  async generateToken(user: UserModel) {
    return sign({
      payload: {
        email: user.email,
        userId: user._id.toString(),
      },
    }, this.config.get('JWT.key'), {
      expiresIn: this.config.get('JWT.ttl'),
      issuer: this.config.get('JWT.issuer'),
    })
  }

  private hashString(st: string) {
    return crypto.createHmac('sha256', this.config.get('passwordHashSecret'))
      .update(st)
      .digest('hex')
  }
}
