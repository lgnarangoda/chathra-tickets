import { UserStatus } from '../enums/user-status.enum';
import type { ApprovalDto } from './approval.dto';
import type { BookingDto } from '../../booking/model/dto/booking.dto';
import type { ChangeRequestDto } from './change-request.dto';
import type { OrganizerDocumentDto } from './organizer-document.dto';
import type { PromotionDto } from '../../promotion/model/dto/promotion.dto';
import type { RefundDto } from '../../refund/model/dto/refund.dto';
import type { TicketDto } from './ticket.dto';
import type { UserRoleDto } from './user-role.dto';

export class UserDto {
  userId: number;

  name: string | null;

  email: string;

  phone: string | null;

  passwordHash: string;

  status: UserStatus;

  isGuest: boolean;

  createdAt: Date;

  updatedAt: Date;

  userRoles?: UserRoleDto[];

  submittedDocuments?: OrganizerDocumentDto[];

  changeRequests?: ChangeRequestDto[];

  tickets?: TicketDto[];

  bookings?: BookingDto[];

  refunds?: RefundDto[];

  promotions?: PromotionDto[];

  approvals?: ApprovalDto[];
}

