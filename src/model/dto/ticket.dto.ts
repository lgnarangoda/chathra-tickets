import { TicketStatus } from '../enums/ticket-status.enum';
import { BaseDto } from './base.dto';
import type { BookingDto } from './booking.dto';
import type { TicketCategoryDto } from './ticket-category.dto';
import type { UserDto } from './user.dto';

export class TicketDto extends BaseDto {
  ticketId: number;

  ticketCategoryId: number;

  userId: number;

  qrCodeUrl: string | null;

  ticketNumber: string | null;

  isCheckedIn: boolean;

  bookingId: number;

  status: TicketStatus;

  ticketCategory?: TicketCategoryDto;

  user?: UserDto;

  booking?: BookingDto;
}

