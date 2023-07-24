import { Module } from '@nestjs/common';

import { BankController } from '@/bank/bank.controller';
import { BankService } from '@/bank/bank.service';
import { PrismaService } from '@/prisma.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [BankController],
  providers: [BankService, PrismaService],
  exports: [BankService],
})
export class BankModule {}
