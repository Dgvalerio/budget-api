import { Injectable } from '@nestjs/common';

import { AccountTypes } from '@/account/account.types';
import { BankService } from '@/bank/bank.service';
import { BankTypes } from '@/bank/bank.types';
import { PrismaService } from '@/prisma.service';
import { Exceptions } from '@/utils/error.messages';

@Injectable()
export class AccountService implements AccountTypes.Service {
  constructor(
    private readonly bankService: BankService,
    private readonly prisma: PrismaService
  ) {}

  async verifyBankBelongsUser(
    bankId: string,
    userId: string
  ): Promise<BankTypes.Entity> {
    const banks = await this.bankService.findAll(userId);

    const belongs = banks.find(({ id }) => bankId === id);

    if (!belongs) throw new Exceptions.Bank.NotFound();

    return belongs;
  }

  async verifyAccountNotFound(
    data: AccountTypes.FindOneDto,
    userId: string
  ): Promise<AccountTypes.Entity> {
    const banks = await this.bankService.findAll(userId);

    const account = await this.prisma.account.findUnique({
      where: data,
      include: { bank: true },
    });

    if (!account) throw new Exceptions.Account.NotFound();

    const exists = banks.find(({ id }) => id === account.bankId);

    if (!exists) throw new Exceptions.Account.NotFound();

    return account;
  }

  async verifyDescriptionConflict(
    description: AccountTypes.Entity['description'],
    userId: string
  ): Promise<AccountTypes.Entity> {
    const banks = await this.bankService.findAll(userId);

    const account = await this.prisma.account.findUnique({
      where: { description },
      include: { bank: true },
    });

    if (!account) return null;

    const exists = banks.find((b) => b.id === account.bankId);

    if (!exists) throw new Exceptions.Account.DescriptionConflict();

    return account;
  }

  async create(
    data: AccountTypes.CreateDto,
    userId: string
  ): Promise<AccountTypes.Entity> {
    if (data.description)
      await this.verifyDescriptionConflict(data.description, userId);

    await this.verifyBankBelongsUser(data.bank, userId);

    const account = await this.prisma.account.create({
      data: {
        description: data.description,
        type: data.type,
        closingDay: data.closingDay,
        bankId: data.bank,
      },
    });

    return await this.findOne({ id: account.id }, userId);
  }

  async findAll(userId: string): Promise<AccountTypes.Entity[]> {
    const accounts: AccountTypes.Entity[] = [];
    const banks = await this.bankService.findAll(userId);

    banks.forEach((b) => {
      accounts.push(...b.Accounts);
    });

    return accounts;
  }

  async findOne(
    data: AccountTypes.FindOneDto,
    userId: string
  ): Promise<AccountTypes.Entity> {
    return await this.verifyAccountNotFound(data, userId);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    await this.verifyAccountNotFound({ id }, userId);

    const deleted = await this.prisma.account.delete({ where: { id } });

    return !!deleted;
  }

  async update(
    id: string,
    data: AccountTypes.UpdateDto,
    userId: string
  ): Promise<AccountTypes.Entity> {
    await this.verifyAccountNotFound({ id }, userId);

    if (data.description)
      await this.verifyDescriptionConflict(data.description, userId);

    const bank = await this.prisma.account.update({
      where: { id },
      data: {
        description: data.description,
        type: data.type,
        closingDay: data.closingDay,
        bankId: data.bank,
      },
    });

    return await this.findOne({ id: bank.id }, userId);
  }
}
