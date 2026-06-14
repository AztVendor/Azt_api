import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            seedDefaultRoles: jest.fn(),
            findByCode: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createSuperAdminIfMissing: jest.fn(),
            createRegisteredUser: jest.fn(),
            findByEmailWithPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
