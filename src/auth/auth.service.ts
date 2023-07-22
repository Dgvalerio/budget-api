import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthTypes } from '@/auth/auth.types';
import { UserService } from '@/user/user.service';
import { UserTypes } from '@/user/user.types';

import { compareSync } from 'bcrypt';

const errorMessages = {
  userUnauthorized: 'Sua senha está incorreta!',
};

@Injectable()
export class AuthService implements AuthTypes.Service {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async jwtToken(user: UserTypes.Entity): Promise<string> {
    const payload: AuthTypes.Payload = { email: user.email, sub: user.id };

    return this.jwtService.signAsync(payload);
  }

  async signIn(data: AuthTypes.SignInDto): Promise<AuthTypes.Entity> {
    const user = await this.userService.findOne({ email: data.email });

    const validPassword = compareSync(data.password, user.password);

    if (!validPassword)
      throw new UnauthorizedException(errorMessages.userUnauthorized);

    const token = await this.jwtToken(user);

    return { user, token };
  }
}
