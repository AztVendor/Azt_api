import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from '../roles/entities/role.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: { role: true },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async createRegisteredUser(
    registerDto: RegisterDto,
    role: Role,
    hashedPassword: string,
  ): Promise<User> {
    const email = registerDto.email.toLowerCase();
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phone,
      role,
      status: 0,
      isActive: false,
      isEmailVerified: false,
    });

    return this.usersRepository.save(user);
  }

  async createSuperAdminIfMissing(
    role: Role,
    email: string,
    hashedPassword: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      return;
    }

    await this.usersRepository.save(
      this.usersRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        status: 1,
        isActive: true,
        isEmailVerified: true,
      }),
    );
  }
}
