import { Account, Bank } from '@prisma/client';

import { accountSchemas } from '@/account/account.schemas';
import { AuthTypes } from '@/auth/auth.types';
import { BankTypes } from '@/bank/bank.types';

import { createZodDto } from 'nestjs-zod';

export namespace AccountTypes {
  export type Entity = Account & { bank: Bank };
  export class CreateDto extends createZodDto(accountSchemas.create) {}
  export class UpdateDto extends createZodDto(accountSchemas.update) {}
  export type FindOneDto = Pick<Entity, 'id'> | Pick<Entity, 'description'>;

  export interface Service {
    verifyBankBelongsUser(
      bankId: string,
      userId: string
    ): Promise<BankTypes.Entity>;
    verifyAccountNotFound(data: FindOneDto, userId: string): Promise<Entity>;
    verifyDescriptionConflict(
      description: Entity['description'],
      userId: string
    ): Promise<Entity>;
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
