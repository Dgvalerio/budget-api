import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma.service';
import { UserTypes } from '@/user/user.types';

const errorMessages = {
  githubIdConflict: 'Esse githubId já foi usado!',
  userNotFound: 'Esse usuário não existe!',
};

@Injectable()
export class UserService implements UserTypes.Service {
  constructor(private prisma: PrismaService) {}

  async verifyUserNotFound(
    id: UserTypes.Entity['id']
  ): Promise<UserTypes.Entity> {
    const exists = await this.prisma.user.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException(errorMessages.userNotFound);
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
    await this.verifyGithubIdConflict(data.githubId);

    return this.prisma.user.create({ data });
  }

  async findOne(id: string): Promise<UserTypes.Entity> {
    return await this.verifyUserNotFound(id);
  }

  async update(
    id: string,
    data: UserTypes.UpdateDto
  ): Promise<UserTypes.Entity> {
    await this.verifyUserNotFound(id);

    if (data.githubId) await this.verifyGithubIdConflict(Number(data.githubId));

    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.verifyUserNotFound(id);

    if (user.id !== id) {
      throw new UnauthorizedException();
    }

    const deleted = await this.prisma.user.delete({ where: { id } });

    return !!deleted;
  }
}
