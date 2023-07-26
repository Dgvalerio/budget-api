import { Test, TestingModule } from '@nestjs/testing';

import { AccountController } from '@/account/account.controller';
import { AccountService } from '@/account/account.service';
import { BankService } from '@/bank/bank.service';
import { PrismaService } from '@/prisma.service';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService, BankService, PrismaService],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
