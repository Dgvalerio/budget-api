import { Bank } from '@prisma/client';

import { AuthTypes } from '@/auth/auth.types';
import { bankSchemas } from '@/bank/bank.schemas';

import { createZodDto } from 'nestjs-zod';

export namespace BankTypes {
  export type Entity = Bank;
  export class CreateDto extends createZodDto(bankSchemas.create) {}
  export class UpdateDto extends createZodDto(bankSchemas.update) {}
  export type FindOneDto = Pick<Entity, 'id'> | Pick<Entity, 'name'>;

  export interface Service {
    verifyBankNotFound(data: FindOneDto, userId: string): Promise<Entity>;
    verifyNameConflict(name: Entity['name'], userId: string): Promise<Entity>;
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
