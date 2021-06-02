import { Body, Controller, HttpStatus, Post, UsePipes } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { StandardResponse } from '../../../helper/response/response.interface'
import { I18nService } from '../../../helper/i18n/i18n.service'
import { JoiValidationPipe } from '../../../pipes/joi-validation.pipe'
import { AuthPostLoginUserDto, AuthPostLoginUserValidation } from './request-dto/post-login.dto'
import { AuthPostSignUpDto, AuthPostSignUpValidation } from './request-dto/post-signup.dto'
import { UserService } from '../../../common/user/user.service'

@ApiTags('Authentication')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Generate JWT token with login',
    description: 'Generate JWT token with login',
  })
  @UsePipes(new JoiValidationPipe({
    body: AuthPostLoginUserValidation,
  }))
  async login(
    @Body() body: AuthPostLoginUserDto,
  ): Promise<StandardResponse> {
    const user = await this.userService.isValidUser(body.email, body.password)
    if (!user) {
      return {
        status: HttpStatus.OK,
        message: this.i18n.__('invalid_user_password_provided'),
        payload: {},
      }
    }
    const token = await this.userService.generateToken(user)
    return {
      status: HttpStatus.OK,
      message: null,
      payload: {
        token,
      },
    }
  }

  @Post('/signup')
  @ApiOperation({
    summary: 'Sign up user into the system',
    description: 'Sign up user into the system',
  })
  @UsePipes(new JoiValidationPipe({
    body: AuthPostSignUpValidation,
  }))
  async signup(
    @Body() body: AuthPostSignUpDto,
  ): Promise<StandardResponse> {
    const user = this.userService.findUserByEmail(body.email)
    if(user){
      return {
        status: HttpStatus.BAD_REQUEST,
        message: this.i18n.__('user_already_exists'),
        payload: {},
      }
    }
    await this.userService.signup(body.email, body.password)
    return {
      status: HttpStatus.OK,
      message: this.i18n.__('sign_up_successful'),
      payload: {},
    }
  }
}
