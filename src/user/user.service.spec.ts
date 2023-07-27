import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/prisma.service';
import { UserService } from '@/user/user.service';
import { UserTypes } from '@/user/user.types';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with Password', async () => {
    const user: UserTypes.CreateDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const promise = service.create(user);

    await expect(promise).resolves.toMatchObject({
      ...user,
      avatarUrl: null,
      githubId: null,
      id: expect.anything(),
      resetPasswordToken: null,
      password: expect.anything(),
    });
  });

  it('should create a user with GitHub', async () => {
    const user: UserTypes.CreateDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.internet.avatar(),
      githubId: faker.number.int({ min: 1, max: 256 }),
    };

    const promise = service.create(user);

    await expect(promise).resolves.toMatchObject({
      ...user,
      id: expect.anything(),
      resetPasswordToken: null,
      password: null,
    });
  });
});
