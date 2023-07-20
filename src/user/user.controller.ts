import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UserService } from '@/user/user.service';
import { UserTypes } from '@/user/user.types';

@Controller('user')
export class UserController implements UserTypes.Controller {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: UserTypes.CreateDto
  ): Promise<UserTypes.Entity> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserTypes.Entity> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UserTypes.UpdateDto
  ): Promise<UserTypes.Entity> {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.userService.remove(id);
  }
}
