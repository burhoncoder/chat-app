import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './app/services/auth.service';
import { SignInDto } from './app/dto/sign-in.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
