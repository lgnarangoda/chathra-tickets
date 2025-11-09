import { BookingStatus } from '../enums/booking-status.enum';
import { BookingPaymentStatus } from '../enums/payment-status.enum';
import { BaseDto } from './base.dto';
import type { EventDto } from './event.dto';
import type { PaymentDto } from './payment.dto';
import type { TicketDto } from './ticket.dto';
import type { UserDto } from './user.dto';

export class BookingDto extends BaseDto {
  bookingId: number;

  userId: number;

  eventId: number;

  status: BookingStatus;

  isTest: boolean;

  referrer: string | null;

  totalAmount: number | null;

  paymentStatus: BookingPaymentStatus;

  user?: UserDto;

  event?: EventDto;

  tickets?: TicketDto[];

  payments?: PaymentDto[];
}

