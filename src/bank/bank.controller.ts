import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';

import { AuthTypes } from '@/auth/auth.types';
import { BankService } from '@/bank/bank.service';
import { BankTypes } from '@/bank/bank.types';

@Controller('bank')
export class BankController implements BankTypes.Controller {
  constructor(private readonly bankService: BankService) {}

  @Post()
  async create(
    @Req() request: AuthTypes.RequestData,
    @Body() data: BankTypes.CreateDto
  ): Promise<BankTypes.Entity> {
    return this.bankService.create(data, request.user.sub);
  }

  @Get()
  async findAll(
    @Req() request: AuthTypes.RequestData
  ): Promise<BankTypes.Entity[]> {
    return this.bankService.findAll(request.user.sub);
  }

  @Get(':id')
  async findOne(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string
  ): Promise<BankTypes.Entity> {
    return this.bankService.findOne({ id }, request.user.sub);
  }

  @Delete(':id')
  async remove(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string
  ): Promise<boolean> {
    return this.bankService.remove(id, request.user.sub);
  }

  @Patch(':id')
  async update(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string,
    @Body() data: BankTypes.UpdateDto
  ): Promise<BankTypes.Entity> {
    return this.bankService.update(id, data, request.user.sub);
  }
}
