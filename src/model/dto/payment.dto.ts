import { PaymentStatus } from '../enums/payment-status.enum';
import { BaseDto } from './base.dto';
import type { BookingDto } from './booking.dto';
import type { RefundDto } from './refund.dto';

export class PaymentDto extends BaseDto {
  paymentId: number;

  bookingId: number;

  paymentMethod: string | null;

  amount: number | null;

  status: PaymentStatus;

  gatewayReferenceId: string | null;

  gatewayName: string | null;

  booking?: BookingDto;

  refunds?: RefundDto[];
}

