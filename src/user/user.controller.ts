import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';

import { Public } from '@/auth/auth.decorators';
import { AuthTypes } from '@/auth/auth.types';
import { UserService } from '@/user/user.service';
import { UserTypes } from '@/user/user.types';

@Controller('user')
export class UserController implements UserTypes.Controller {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(
    @Body() createUserDto: UserTypes.CreateDto
  ): Promise<UserTypes.UserDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findOne(@Req() req: AuthTypes.RequestData): Promise<UserTypes.UserDto> {
    return this.userService.findOne({ id: req.user.sub });
  }

  @Patch()
  async update(
    @Req() req: AuthTypes.RequestData,
    @Body() data: UserTypes.UpdateDto
  ): Promise<UserTypes.UserDto> {
    return this.userService.update(req.user.sub, data);
  }

  @Delete()
  async remove(@Req() req: AuthTypes.RequestData): Promise<boolean> {
    return this.userService.remove(req.user.sub);
  }
}
