import { BookingStatus } from '../../../model/enums/booking-status.enum';
import { BookingPaymentStatus } from '../../../model/enums/payment-status.enum';
import { BaseDto } from '../../../model/dto/base.dto';
import type { EventDto } from '../../../event/model/dto/event.dto';
import type { PaymentDto } from '../../../payment/model/dto/payment.dto';
import type { TicketDto } from '../../../model/dto/ticket.dto';
import type { UserDto } from '../../../model/dto/user.dto';

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


