import { Module } from '@nestjs/common';

import { AccountController } from '@/account/account.controller';
import { AccountService } from '@/account/account.service';
import { BankModule } from '@/bank/bank.module';
import { PrismaService } from '@/prisma.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule, BankModule],
  controllers: [AccountController],
  providers: [AccountService, PrismaService],
})
export class AccountModule {}
