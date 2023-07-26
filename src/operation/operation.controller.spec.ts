import { Test, TestingModule } from '@nestjs/testing';

import { AccountService } from '@/account/account.service';
import { BankService } from '@/bank/bank.service';
import { OperationController } from '@/operation/operation.controller';
import { OperationService } from '@/operation/operation.service';
import { PrismaService } from '@/prisma.service';

describe('OperationController', () => {
  let controller: OperationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationController],
      providers: [OperationService, AccountService, BankService, PrismaService],
    }).compile();

    controller = module.get<OperationController>(OperationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
