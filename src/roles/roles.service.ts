import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DEFAULT_ROLES } from '../auth/constants/auth.constants';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async seedDefaultRoles(): Promise<void> {
    for (const defaultRole of DEFAULT_ROLES) {
      const existingRole = await this.rolesRepository.findOne({
        where: { roleCode: String(defaultRole.roleCode) },
      });

      if (!existingRole) {
        await this.rolesRepository.save(
          this.rolesRepository.create({
            ...defaultRole,
            roleCode: String(defaultRole.roleCode),
          }),
        );
      }
    }
  }

  async findByCode(roleCode: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { roleCode: String(roleCode) },
    });

    if (!role) {
      throw new NotFoundException(`Role code ${roleCode} does not exist`);
    }

    return role;
  }
}
