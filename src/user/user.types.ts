import { Prisma, User } from '@prisma/client';

export namespace UserTypes {
  export type Entity = User;
  export type CreateDto = Prisma.UserCreateInput;
  export type UpdateDto = Prisma.UserUpdateInput;

  export interface Service {
    verifyUserNotFound(id: Entity['id']): Promise<Entity>;
    verifyGithubIdConflict(githubId: Entity['githubId']): Promise<Entity>;
    create(data: CreateDto): Promise<User>;
    findOne(id: string): Promise<User>;
    update(id: string, data: UpdateDto): Promise<User>;
    remove(id: string): Promise<boolean>;
  }

  export interface Controller {
    create(data: CreateDto): Promise<User>;
    findOne(id: string): Promise<User>;
    update(id: string, data: UpdateDto): Promise<User>;
    remove(id: string): Promise<boolean>;
  }
}
