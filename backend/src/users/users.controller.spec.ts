import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcryptjs';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((dto) => ({
      id: 'mockID',
      ...dto,
    })),
    findAll: jest.fn(() => { }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).overrideProvider(UsersService).useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const pwd = hashSync('password', 10);
    const fakeUser = {
      email: 'a@a.com',
      username: 'babo',
      password: pwd,
    };
    expect(controller.create(fakeUser)).toEqual({
      id: expect.any(String),
      email: fakeUser.email,
      username: fakeUser.username,
      password: fakeUser.password,
    });
    expect(mockUsersService.create).toHaveBeenCalledWith(fakeUser);
  });
});
