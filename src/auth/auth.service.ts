import {
  ForbiddenException,
  Injectable,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  DEFAULT_SUPER_ADMIN,
  ROLE_CODES,
  USER_STATUS,
} from './constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RolesService } from '../roles/roles.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly saltRounds = 12;

  constructor(
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.rolesService.seedDefaultRoles();
    await this.seedDefaultSuperAdmin();
  }

  async register(registerDto: RegisterDto) {
    const vendorRole = await this.rolesService.findByCode(ROLE_CODES.VENDOR);
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.saltRounds,
    );
    const user = await this.usersService.createRegisteredUser(
      registerDto,
      vendorRole,
      hashedPassword,
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      roleCode: Number(vendorRole.roleCode),
      roleName: vendorRole.roleName,
      status: user.status,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    this.assertUserCanLogin(user);

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      roleCode: Number(user.role.roleCode),
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        roleCode: Number(user.role.roleCode),
        roleName: user.role.roleName,
      },
    };
  }

  private async seedDefaultSuperAdmin(): Promise<void> {
    const superAdminRole = await this.rolesService.findByCode(
      ROLE_CODES.SUPER_ADMIN,
    );
    const hashedPassword = await bcrypt.hash(
      DEFAULT_SUPER_ADMIN.password,
      this.saltRounds,
    );

    await this.usersService.createSuperAdminIfMissing(
      superAdminRole,
      DEFAULT_SUPER_ADMIN.email,
      hashedPassword,
      DEFAULT_SUPER_ADMIN.firstName,
      DEFAULT_SUPER_ADMIN.lastName,
    );
  }

  private assertUserCanLogin(user: User): void {
    if (user.status === USER_STATUS.PENDING_APPROVAL) {
      throw new ForbiddenException(
        'Account pending approval. Please contact administrator.',
      );
    }

    if (user.status === USER_STATUS.REJECTED) {
      throw new ForbiddenException('Account rejected.');
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ForbiddenException('Account suspended.');
    }

    if (user.status !== USER_STATUS.APPROVED || !user.isActive) {
      throw new ForbiddenException(
        'Account is inactive. Please contact administrator.',
      );
    }
  }
}
