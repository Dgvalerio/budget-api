import { Test, TestingModule } from '@nestjs/testing';

import { BankController } from '@/bank/bank.controller';
import { BankService } from '@/bank/bank.service';
import { PrismaService } from '@/prisma.service';

describe('BankController', () => {
  let controller: BankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankController],
      providers: [BankService, PrismaService],
    }).compile();

    controller = module.get<BankController>(BankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
