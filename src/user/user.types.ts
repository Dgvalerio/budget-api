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
    create(data: CreateDto): Promise<Entity>;
    findOne(data: FindOneDto): Promise<Entity>;
    update(id: string, data: UpdateDto): Promise<Entity>;
    remove(id: string): Promise<boolean>;
  }

  export interface Controller {
    create(data: CreateDto): Promise<Entity>;
    findOne(request: AuthTypes.RequestData): Promise<Entity>;
    update(request: AuthTypes.RequestData, data: UpdateDto): Promise<Entity>;
    remove(request: AuthTypes.RequestData): Promise<boolean>;
  }
}
