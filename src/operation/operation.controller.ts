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
import { OperationService } from '@/operation/operation.service';
import { OperationTypes } from '@/operation/operation.types';

@Controller('operation')
export class OperationController implements OperationTypes.Controller {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  async create(
    @Req() request: AuthTypes.RequestData,
    @Body() data: OperationTypes.CreateDto
  ): Promise<OperationTypes.Entity> {
    return this.operationService.create(data, request.user.sub);
  }

  @Get()
  async findAll(
    @Req() request: AuthTypes.RequestData
  ): Promise<OperationTypes.Entity[]> {
    return this.operationService.findAll(request.user.sub);
  }

  @Get(':id')
  async findOne(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string
  ): Promise<OperationTypes.Entity> {
    return this.operationService.findOne({ id }, request.user.sub);
  }

  @Patch(':id')
  async update(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string,
    @Body() updateOperationDto: OperationTypes.UpdateDto
  ): Promise<OperationTypes.Entity> {
    return this.operationService.update(
      id,
      updateOperationDto,
      request.user.sub
    );
  }

  @Delete(':id')
  async remove(
    @Req() request: AuthTypes.RequestData,
    @Param('id') id: string
  ): Promise<boolean> {
    return this.operationService.remove(id, request.user.sub);
  }
}
