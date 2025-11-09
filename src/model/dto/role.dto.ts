import type { UserRoleDto } from './user-role.dto';

export class RoleDto {
  roleId: number;

  name: string;

  userRoles?: UserRoleDto[];
}

