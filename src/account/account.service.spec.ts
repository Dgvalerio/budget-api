import { Test, TestingModule } from '@nestjs/testing';

import { AccountService } from '@/account/account.service';
import { BankService } from '@/bank/bank.service';
import { PrismaService } from '@/prisma.service';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, BankService, PrismaService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
