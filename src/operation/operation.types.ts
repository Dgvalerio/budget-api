import { Operation } from '@prisma/client';

import { AccountTypes } from '@/account/account.types';
import { AuthTypes } from '@/auth/auth.types';
import { operationSchemas } from '@/operation/operation.schemas';

import { createZodDto } from 'nestjs-zod';

export namespace OperationTypes {
  export type Entity = Operation;
  export class CreateDto extends createZodDto(operationSchemas.create) {}
  export class UpdateDto extends createZodDto(operationSchemas.update) {}
  export type FindOneDto = Pick<Entity, 'id'>;

  export interface Service {
    verifyAccountBelongsUser(
      accountId: string,
      userId: string
    ): Promise<AccountTypes.Entity>;
    verifyOperationNotFound(data: FindOneDto, userId: string): Promise<Entity>;
    create(data: CreateDto, userId: string): Promise<Entity>;
    findOne(data: FindOneDto, userId: string): Promise<Entity>;
    findAll(userId: string): Promise<Entity[]>;
    update(id: string, data: UpdateDto, userId: string): Promise<Entity>;
    remove(id: string, userId: string): Promise<boolean>;
  }

  export interface Controller {
    create(request: AuthTypes.RequestData, data: CreateDto): Promise<Entity>;
    findOne(request: AuthTypes.RequestData, id: string): Promise<Entity>;
    findAll(request: AuthTypes.RequestData): Promise<Entity[]>;
    update(
      request: AuthTypes.RequestData,
      id: string,
      data: UpdateDto
    ): Promise<Entity>;
    remove(request: AuthTypes.RequestData, id: string): Promise<boolean>;
  }
}
