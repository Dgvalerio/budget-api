import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { BankTypes } from '@/bank/bank.types';
import { PrismaService } from '@/prisma.service';
import { UserService } from '@/user/user.service';

const errorMessages = {
  nameConflict: 'Esse nome já foi usado!',
  bankNotFound: 'Esse banco não existe!',
};

@Injectable()
export class BankService implements BankTypes.Service {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService
  ) {}

  async verifyBankNotFound(
    data: BankTypes.FindOneDto,
    userId: string
  ): Promise<BankTypes.Entity> {
    const exists = await this.prisma.bank.findUnique({
      where: { ...data, userId },
    });

    if (!exists) throw new NotFoundException(errorMessages.bankNotFound);

    return exists;
  }

  async verifyNameConflict(
    name: BankTypes.Entity['name'],
    userId: string
  ): Promise<BankTypes.Entity> {
    const exists = await this.prisma.bank.findUnique({
      where: { name, userId },
    });

    if (exists) throw new ConflictException(errorMessages.nameConflict);

    return exists;
  }

  async create(
    data: BankTypes.CreateDto,
    userId: string
  ): Promise<BankTypes.Entity> {
    if (data.name) await this.verifyNameConflict(data.name, userId);

    return this.prisma.bank.create({
      data: {
        name: data.name,
        color: data.color,
        userId: userId,
      },
    });
  }

  async findAll(userId: string): Promise<BankTypes.Entity[]> {
    return this.prisma.bank.findMany({ where: { userId } });
  }

  async findOne(
    data: BankTypes.FindOneDto,
    userId: string
  ): Promise<BankTypes.Entity> {
    return await this.verifyBankNotFound(data, userId);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const bank = await this.verifyBankNotFound({ id }, userId);

    if (bank.id !== id) {
      throw new UnauthorizedException();
    }

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

    return this.prisma.bank.update({
      where: { id, userId },
      data: {
        name: data.name,
        color: data.color,
      },
    });
  }
}
