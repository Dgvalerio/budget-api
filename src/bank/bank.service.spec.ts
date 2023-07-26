import { Test, TestingModule } from '@nestjs/testing';

import { BankService } from '@/bank/bank.service';
import { PrismaService } from '@/prisma.service';

describe('BankService', () => {
  let service: BankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankService, PrismaService],
    }).compile();

    service = module.get<BankService>(BankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
