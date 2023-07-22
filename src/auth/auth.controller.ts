import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from '@/auth/auth.decorators';
import { AuthService } from '@/auth/auth.service';
import { AuthTypes } from '@/auth/auth.types';

@Controller('auth')
export class AuthController implements AuthTypes.Controller {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() data: AuthTypes.SignInDto): Promise<AuthTypes.Entity> {
    return this.authService.signIn(data);
  }

  @Public()
  @Post('github-sign-in')
  async githubSignIn(
    @Body() data: AuthTypes.GithubDto
  ): Promise<AuthTypes.Entity> {
    return this.authService.githubSignIn(data);
  }
}
