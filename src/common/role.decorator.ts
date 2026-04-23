import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const RoleDecorator = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);