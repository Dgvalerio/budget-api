import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthTypes } from '@/auth/auth.types';
import { PrismaService } from '@/prisma.service';
import { UserService } from '@/user/user.service';
import { UserTypes } from '@/user/user.types';

import { compareSync } from 'bcrypt';

const errorMessages = {
  userUnauthorized: 'Sua senha está incorreta!',
  githubUnauthorized: 'Seu código é inválido!',
};

@Injectable()
export class AuthService implements AuthTypes.Service {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
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

  async githubSignIn(data: AuthTypes.GithubDto): Promise<AuthTypes.Entity> {
    const response =
      await this.httpService.axiosRef.post<AuthTypes.GithubToken>(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: data.code,
          },
          headers: { Accept: 'application/json' },
        }
      );

    if (!response.data.access_token) {
      throw new UnauthorizedException(errorMessages.githubUnauthorized);
    }

    const { access_token } = response.data;

    const githubUser =
      await this.httpService.axiosRef.get<AuthTypes.GithubUser>(
        'https://api.github.com/user',
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

    let user = await this.prisma.user.findUnique({
      where: { githubId: githubUser.data.id },
    });

    if (!user) {
      user = await this.userService.create({
        githubId: githubUser.data.id,
        name: githubUser.data.name,
        email: githubUser.data.email,
        avatarUrl: githubUser.data.avatar_url,
      });
    }

    const token = await this.jwtToken(user);

    return { user, token };
  }
}
