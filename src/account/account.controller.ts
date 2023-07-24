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

import { AccountService } from '@/account/account.service';
import { AccountTypes } from '@/account/account.types';
import { AuthTypes } from '@/auth/auth.types';

@Controller('account')
export class AccountController implements AccountTypes.Controller {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(
    @Req() request: AuthTypes.RequestData,
    @Body() data: AccountTypes.CreateDto
  ): Promise<AccountTypes.Entity> {
    return this.accountService.create(data, request.user.sub);
  }

  @Get()
  findAll(
    @Req() request: AuthTypes.RequestData
  ): Promise<AccountTypes.Entity[]> {
    return this.accountService.findAll(request.user.sub);
  }

  @Get(':id')
  findOne(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string
  ): Promise<AccountTypes.Entity> {
    return this.accountService.findOne({ id }, request.user.sub);
  }

  @Delete(':id')
  remove(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string
  ): Promise<boolean> {
    return this.accountService.remove(id, request.user.sub);
  }

  @Patch(':id')
  update(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string,
    @Body() data: AccountTypes.UpdateDto
  ): Promise<AccountTypes.Entity> {
    return this.accountService.update(id, data, request.user.sub);
  }
}
