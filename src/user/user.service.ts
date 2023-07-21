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

const errorMessages = {
  githubIdConflict: 'Esse githubId já foi usado!',
  emailConflict: 'Esse e-mail já foi usado!',
  userNotFound: 'Esse usuário não existe!',
};

@Injectable()
export class UserService implements UserTypes.Service {
  constructor(private prisma: PrismaService) {}

  async verifyUserNotFound(
    data: UserTypes.FindOneDto
  ): Promise<UserTypes.Entity> {
    const exists = await this.prisma.user.findUnique({ where: data });

    if (!exists) {
      throw new NotFoundException(errorMessages.userNotFound);
    }

    return exists;
  }

  async verifyEmailConflict(
    email: UserTypes.Entity['email']
  ): Promise<UserTypes.Entity> {
    const exists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ConflictException(errorMessages.emailConflict);
    }

    return exists;
  }

  async verifyGithubIdConflict(
    githubId: UserTypes.Entity['githubId']
  ): Promise<UserTypes.Entity> {
    const exists = await this.prisma.user.findUnique({
      where: { githubId },
    });

    if (exists) {
      throw new ConflictException(errorMessages.githubIdConflict);
    }

    return exists;
  }

  async create(data: UserTypes.CreateDto): Promise<UserTypes.Entity> {
    if (data.githubId) await this.verifyGithubIdConflict(data.githubId);
    if (data.email) await this.verifyEmailConflict(data.email);

    const input: Prisma.UserCreateInput = {
      name: data.name,
      email: data.email,
    };

    if (data.avatarUrl) input.avatarUrl = data.avatarUrl;

    if (data.password) input.password = hashPasswordTransform.to(data.password);
    else input.githubId = data.githubId;

    return this.prisma.user.create({ data: input });
  }

  async findOne(data: UserTypes.FindOneDto): Promise<UserTypes.Entity> {
    return await this.verifyUserNotFound(data);
  }

  async update(
    id: string,
    data: UserTypes.UpdateDto
  ): Promise<UserTypes.Entity> {
    await this.verifyUserNotFound({ id });

    if (data.githubId) await this.verifyGithubIdConflict(Number(data.githubId));

    return this.prisma.user.update({ where: { id }, data });
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
