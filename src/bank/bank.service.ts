import { Injectable } from '@nestjs/common';

import { BankTypes } from '@/bank/bank.types';
import { PrismaService } from '@/prisma.service';
import { Exceptions } from '@/utils/error.messages';

@Injectable()
export class BankService implements BankTypes.Service {
  constructor(private readonly prisma: PrismaService) {}

  async verifyBankNotFound(
    data: BankTypes.FindOneDto,
    userId: string
  ): Promise<BankTypes.Entity> {
    const exists = await this.prisma.bank.findUnique({
      where: { ...data, userId },
      include: { Accounts: { include: { bank: true } } },
    });

    if (!exists) throw new Exceptions.Bank.NotFound();

    return exists;
  }

  async verifyNameConflict(
    name: BankTypes.Entity['name'],
    userId: string
  ): Promise<BankTypes.Entity> {
    const exists = await this.prisma.bank.findUnique({
      where: { name, userId },
      include: { Accounts: { include: { bank: true } } },
    });

    if (exists) throw new Exceptions.Bank.NameConflict();

    return exists;
  }

  async create(
    data: BankTypes.CreateDto,
    userId: string
  ): Promise<BankTypes.Entity> {
    if (data.name) await this.verifyNameConflict(data.name, userId);

    const bank = await this.prisma.bank.create({
      data: {
        name: data.name,
        color: data.color,
        userId: userId,
      },
    });

    return await this.findOne({ id: bank.id }, userId);
  }

  async findAll(userId: string): Promise<BankTypes.Entity[]> {
    return this.prisma.bank.findMany({
      where: { userId },
      include: { Accounts: { include: { bank: true } } },
    });
  }

  async findOne(
    data: BankTypes.FindOneDto,
    userId: string
  ): Promise<BankTypes.Entity> {
    return await this.verifyBankNotFound(data, userId);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    await this.verifyBankNotFound({ id }, userId);

    const deleted = await this.prisma.bank.delete({ where: { id } });

    return !!deleted;
  }

  async update(
    id: string,
    data: BankTypes.UpdateDto,
    userId: string
  ): Promise<BankTypes.Entity> {
    await this.verifyBankNotFound({ id }, userId);

    if (data.name) await this.verifyNameConflict(data.name, userId);

    const bank = await this.prisma.bank.update({
      where: { id, userId },
      data: {
        name: data.name,
        color: data.color,
      },
    });

    return await this.findOne({ id: bank.id }, userId);
  }
}
