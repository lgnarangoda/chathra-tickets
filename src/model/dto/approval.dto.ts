import { ApprovalStatus } from '../enums/approval-status.enum';
import { BaseDto } from './base.dto';
import type { ChangeRequestDto } from './change-request.dto';
import type { UserDto } from './user.dto';

export class ApprovalDto extends BaseDto {
  approvalId: number;

  changeRequestId: number | null;

  approverId: number | null;

  approvedAt: Date | null;

  approvalStatus: ApprovalStatus;

  approvalNotes: string | null;

  changeRequest?: ChangeRequestDto | null;

  approver?: UserDto | null;
}

