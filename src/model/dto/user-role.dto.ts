import type { RoleDto } from './role.dto';
import type { UserDto } from './user.dto';

export class UserRoleDto {
  id: number;

  userId: number;

  roleId: number;

  user?: UserDto;

  role?: RoleDto;
}

