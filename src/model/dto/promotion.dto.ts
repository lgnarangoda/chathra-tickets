import { PromotionStatus } from '../enums/promotion-status.enum';
import { BaseDto } from './base.dto';
import type { EventDto } from './event.dto';

export class PromotionDto extends BaseDto {
  promotionId: number;

  eventId: number;

  name: string | null;

  code: string | null;

  maxDiscountAmount: number | null;

  discountType: string | null;

  discountValue: number | null;

  validFrom: Date | null;

  validTo: Date | null;

  maxUses: number | null;

  maxUsesPerUser: number | null;

  minPurchaseAmount: number | null;

  applicableTicketCategories: string[] | null;

  promotionType: string | null;

  promotionStatus: PromotionStatus;

  isStackable: boolean;

  isActive: boolean;

  colorName: string | null;

  colorCode: string | null;

  event?: EventDto;
}

