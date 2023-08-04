import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma.service';
import { UserTypes } from '@/user/user.types';
import { hashPasswordTransform } from '@/utils/crypto';
import { errorMessages } from '@/utils/error.messages';

@Injectable()
export class UserService implements UserTypes.Service {
  constructor(private readonly prisma: PrismaService) {}

  adapter(data: UserTypes.Entity): UserTypes.UserDto {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
      githubId: data.githubId,
    };
  }

  async verifyUserNotFound(
    data: UserTypes.FindOneDto
  ): Promise<UserTypes.Entity> {
    const exists = await this.prisma.user.findUnique({ where: data });

    if (!exists) throw new NotFoundException(errorMessages.user.userNotFound);

    return exists;
  }

  async verifyEmailConflict(
    email: UserTypes.Entity['email']
  ): Promise<UserTypes.Entity> {
    const exists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exists) throw new ConflictException(errorMessages.user.emailConflict);

    return exists;
  }

  async verifyGithubIdConflict(
    githubId: UserTypes.Entity['githubId']
  ): Promise<UserTypes.Entity> {
    const exists = await this.prisma.user.findUnique({
      where: { githubId },
    });

    if (exists)
      throw new ConflictException(errorMessages.user.githubIdConflict);

    return exists;
  }

  async create(data: UserTypes.CreateDto): Promise<UserTypes.UserDto> {
    if (data.githubId) await this.verifyGithubIdConflict(data.githubId);
    if (data.email) await this.verifyEmailConflict(data.email);

    const input: Prisma.UserCreateInput = {
      name: data.name,
      email: data.email,
    };

    if (data.avatarUrl) input.avatarUrl = data.avatarUrl;

    if (data.password) input.password = hashPasswordTransform.to(data.password);
    else input.githubId = data.githubId;

    const user = await this.prisma.user.create({ data: input });

    return this.adapter(user);
  }

  async findOne(data: UserTypes.FindOneDto): Promise<UserTypes.UserDto> {
    const user = await this.verifyUserNotFound(data);

    return this.adapter(user);
  }

  async update(
    id: string,
    data: UserTypes.UpdateDto
  ): Promise<UserTypes.UserDto> {
    const old = await this.verifyUserNotFound({ id });

    if (data.githubId) await this.verifyGithubIdConflict(data.githubId);
    if (data.email) await this.verifyEmailConflict(data.email);

    const input: Prisma.UserUpdateInput = {};

    if (data.name) input.name = data.name;
    if (data.email) input.email = data.email;
    if (data.avatarUrl) input.avatarUrl = data.avatarUrl;

    if (old.githubId) {
      if (data.githubId) input.githubId = data.githubId;
    } else if (old.password) {
      if (data.password)
        input.password = hashPasswordTransform.to(data.password);
    }

    const user = await this.prisma.user.update({ where: { id }, data: input });

    return this.adapter(user);
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.verifyUserNotFound({ id });

    if (user.id !== id) {
      throw new UnauthorizedException();
    }

    const deleted = await this.prisma.user.delete({ where: { id } });

    return !!deleted;
  }
}
