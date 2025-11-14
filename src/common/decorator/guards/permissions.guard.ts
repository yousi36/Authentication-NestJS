// src/common/guards/permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/authorization/schemas/role.schema';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    const role = await this.roleModel
      .findById(user.role)
      .populate('permissions');

    if (!role) return false;

    // Get all permission names from the role
    const rolePermissions = role.permissions.map((p) => p.name);

    // Admin override (Admin gets everything automatically)
    if (role.name === 'Admin') return true;

    // Check if role has all required permissions
    return requiredPermissions.every((perm) =>
      rolePermissions.includes(perm),
    );
  }
}
