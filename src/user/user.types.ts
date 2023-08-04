import { User } from '@prisma/client';

import { AuthTypes } from '@/auth/auth.types';
import { userSchemas } from '@/user/user.schemas';

import { createZodDto } from 'nestjs-zod';

export namespace UserTypes {
  export type Entity = User;
  export class CreateDto extends createZodDto(userSchemas.create) {}
  export class UpdateDto extends createZodDto(userSchemas.update) {}
  export type FindOneDto = Pick<Entity, 'id'> | Pick<Entity, 'email'>;
  export interface UserDto {
    id: Entity['id'];
    githubId: Entity['githubId'];
    name: Entity['name'];
    email: Entity['email'];
    avatarUrl: Entity['avatarUrl'];
  }

  export interface Service {
    adapter(data: Entity): UserDto;
    verifyUserNotFound(data: FindOneDto): Promise<Entity>;
    verifyEmailConflict(email: Entity['email']): Promise<Entity>;
    verifyGithubIdConflict(githubId: Entity['githubId']): Promise<Entity>;
    create(data: CreateDto): Promise<UserDto>;
    findOne(data: FindOneDto): Promise<UserDto>;
    update(id: string, data: UpdateDto): Promise<UserDto>;
    remove(id: string): Promise<boolean>;
  }

  export interface Controller {
    create(data: CreateDto): Promise<UserDto>;
    findOne(request: AuthTypes.RequestData): Promise<UserDto>;
    update(request: AuthTypes.RequestData, data: UpdateDto): Promise<UserDto>;
    remove(request: AuthTypes.RequestData): Promise<boolean>;
  }
}
