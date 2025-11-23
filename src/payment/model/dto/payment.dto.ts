import { PaymentStatus } from '../../../model/enums/payment-status.enum';
import { BaseDto } from '../../../model/dto/base.dto';
import type { BookingDto } from '../../../booking/model/dto/booking.dto';
import type { RefundDto } from '../../../refund/model/dto/refund.dto';

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


