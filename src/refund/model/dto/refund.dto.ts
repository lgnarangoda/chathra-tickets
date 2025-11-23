import { RefundStatus } from '../../../model/enums/refund-status.enum';
import type { PaymentDto } from '../../../payment/model/dto/payment.dto';
import type { UserDto } from '../../../model/dto/user.dto';

export class RefundDto {
  refundId: number;

  paymentId: number;

  refundAmount: number | null;

  refundTime: Date;

  updatedAt: Date | null;

  status: RefundStatus;

  refundedById: number | null;

  payment?: PaymentDto;

  refundedBy?: UserDto | null;
}


