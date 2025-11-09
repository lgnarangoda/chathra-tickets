import { EntityType } from '../enums/entity-type.enum';
import { ChangeRequestApprovalStatus } from '../enums/approval-status.enum';
import { BaseDto } from './base.dto';
import type { ApprovalDto } from './approval.dto';
import type { UserDto } from './user.dto';

export class ChangeRequestDto extends BaseDto {
  changeRequestId: number;

  entityType: EntityType | null;

  originalEntityId: number | null;

  draftEntityId: number | null;

  submittedById: number | null;

  approvalStatus: ChangeRequestApprovalStatus;

  notes: string | null;

  submittedBy?: UserDto | null;

  approval?: ApprovalDto | null;
}

