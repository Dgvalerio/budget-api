import { Injectable } from '@nestjs/common';

import { AccountService } from '@/account/account.service';
import { AccountTypes } from '@/account/account.types';
import { OperationTypes } from '@/operation/operation.types';
import { PrismaService } from '@/prisma.service';
import { Exceptions } from '@/utils/error.messages';

@Injectable()
export class OperationService implements OperationTypes.Service {
  constructor(
    private readonly accountService: AccountService,
    private readonly prisma: PrismaService
  ) {}

  async verifyAccountBelongsUser(
    accountId: string,
    userId: string
  ): Promise<AccountTypes.Entity> {
    const account = await this.accountService.findOne(
      { id: accountId },
      userId
    );

    if (!account) throw new Exceptions.Operation.NotFound();

    return account;
  }

  async verifyOperationNotFound(
    data: OperationTypes.FindOneDto,
    userId: string
  ): Promise<OperationTypes.Entity> {
    const operation = await this.prisma.operation.findUnique({
      where: data,
      include: { account: true },
    });

    if (!operation) throw new Exceptions.Operation.NotFound();

    await this.verifyAccountBelongsUser(operation.accountId, userId);

    return operation;
  }

  async create(
    data: OperationTypes.CreateDto,
    userId: string
  ): Promise<OperationTypes.Entity> {
    await this.verifyAccountBelongsUser(data.account, userId);

    const operation = await this.prisma.operation.create({
      data: {
        accountId: data.account,
        description: data.description,
        date: data.date,
        category: data.category,
        paid: data.paid,
        repeat: data.repeat,
        value: data.value,
        installments: data.installments,
      },
    });

    return await this.findOne({ id: operation.id }, userId);
  }

  async findAll(userId: string): Promise<OperationTypes.Entity[]> {
    const operations: OperationTypes.Entity[] = [];
    const accounts = await this.accountService.findAll(userId);

    accounts.forEach((account) => operations.push(...account.Operations));

    return operations;
  }

  async findOne(
    data: OperationTypes.FindOneDto,
    userId: string
  ): Promise<OperationTypes.Entity> {
    return await this.verifyOperationNotFound(data, userId);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    await this.verifyOperationNotFound({ id }, userId);

    const deleted = await this.prisma.operation.delete({ where: { id } });

    return !!deleted;
  }

  async update(
    id: string,
    data: OperationTypes.UpdateDto,
    userId: string
  ): Promise<OperationTypes.Entity> {
    await this.verifyOperationNotFound({ id }, userId);

    const bank = await this.prisma.operation.update({
      where: { id },
      data: {
        accountId: data.account,
        description: data.description,
        date: data.date,
        category: data.category,
        paid: data.paid,
        repeat: data.repeat,
        value: data.value,
        installments: data.installments,
      },
    });

    return await this.findOne({ id: bank.id }, userId);
  }
}
