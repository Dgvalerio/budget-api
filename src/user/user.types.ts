import { User } from '@prisma/client';

import { AuthTypes } from '@/auth/auth.types';
import { userSchemas } from '@/user/user.schemas';

import { createZodDto } from 'nestjs-zod';

export namespace UserTypes {
  export type Entity = User;
  export class CreateDto extends createZodDto(userSchemas.create) {}
  export class UpdateDto extends createZodDto(userSchemas.update) {}
  export type FindOneDto = Pick<Entity, 'id'> | Pick<Entity, 'email'>;

  export interface Service {
    verifyUserNotFound(data: FindOneDto): Promise<Entity>;
    verifyEmailConflict(email: Entity['email']): Promise<Entity>;
    verifyGithubIdConflict(githubId: Entity['githubId']): Promise<Entity>;
    create(data: CreateDto): Promise<User>;
    findOne(data: FindOneDto): Promise<User>;
    update(id: string, data: UpdateDto): Promise<User>;
    remove(id: string): Promise<boolean>;
  }

  export interface Controller {
    create(data: CreateDto): Promise<User>;
    findOne(request: AuthTypes.RequestData): Promise<User>;
    update(request: AuthTypes.RequestData, data: UpdateDto): Promise<User>;
    remove(request: AuthTypes.RequestData): Promise<boolean>;
  }
}
