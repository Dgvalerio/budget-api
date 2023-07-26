import { Test, TestingModule } from '@nestjs/testing';

import { AccountService } from '@/account/account.service';
import { BankService } from '@/bank/bank.service';
import { OperationService } from '@/operation/operation.service';
import { PrismaService } from '@/prisma.service';

describe('OperationService', () => {
  let service: OperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationService, AccountService, PrismaService, BankService],
    }).compile();

    service = module.get<OperationService>(OperationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
