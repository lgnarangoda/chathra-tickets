import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PromotionStatus } from '../../model/enums/promotion-status.enum';
import { BaseEntity } from '../../model/base.entity';
import { Event } from '../../event/model/eventData.entity';

@Entity('promotion')
@Index(['eventId'])
@Index(['code'])
@Index(['isActive'])
@Index(['promotionStatus'])
@Index(['validFrom'])
@Index(['validTo'])
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'promotion_id' })
  promotionId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: false })
  eventId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'max_discount_amount',
    nullable: true,
  })
  maxDiscountAmount: number | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'discount_type',
    nullable: true,
  })
  discountType: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'discount_value',
    nullable: true,
  })
  discountValue: number | null;

  @Column({ type: 'timestamp', name: 'valid_from', nullable: true })
  validFrom: Date | null;

  @Column({ type: 'timestamp', name: 'valid_to', nullable: true })
  validTo: Date | null;

  @Column({ type: 'int', name: 'max_uses', nullable: true })
  maxUses: number | null;

  @Column({ type: 'int', name: 'max_uses_per_user', nullable: true })
  maxUsesPerUser: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'min_purchase_amount',
    nullable: true,
  })
  minPurchaseAmount: number | null;

  @Column({
    type: 'simple-array',
    name: 'applicable_ticket_categories',
    nullable: true,
  })
  applicableTicketCategories: string[] | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'promotion_type',
    nullable: true,
  })
  promotionType: string | null;

  @Column({
    type: 'enum',
    enum: PromotionStatus,
    name: 'promotion_status',
    default: PromotionStatus.ACTIVE,
  })
  promotionStatus: PromotionStatus;

  @Column({ type: 'boolean', name: 'is_stackable', default: false })
  isStackable: boolean;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 50, name: 'color_name', nullable: true })
  colorName: string | null;

  @Column({ type: 'varchar', length: 20, name: 'color_code', nullable: true })
  colorCode: string | null;

  @ManyToOne(() => Event, (event) => event.promotions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
