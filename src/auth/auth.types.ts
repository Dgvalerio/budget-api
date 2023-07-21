import { authSchemas } from '@/auth/auth.schemas';
import { UserTypes } from '@/user/user.types';

import { createZodDto } from 'nestjs-zod';

export namespace AuthTypes {
  export interface Entity {
    user: UserTypes.Entity;
    token: string;
  }
  export class SignInDto extends createZodDto(authSchemas.signIn) {}

  export interface Service {
    jwtToken(user: UserTypes.Entity): Promise<string>;
    signIn(signInDto: SignInDto): Promise<Entity>;
  }

  export interface Controller {
    signIn(signInDto: SignInDto): Promise<Entity>;
  }
}
