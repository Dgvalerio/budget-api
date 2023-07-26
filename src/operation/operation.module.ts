import { Module } from '@nestjs/common';

import { AccountModule } from '@/account/account.module';
import { OperationController } from '@/operation/operation.controller';
import { OperationService } from '@/operation/operation.service';
import { PrismaService } from '@/prisma.service';

@Module({
  imports: [AccountModule],
  controllers: [OperationController],
  providers: [OperationService, PrismaService],
})
export class OperationModule {}
