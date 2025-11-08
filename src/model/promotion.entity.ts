import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from './user.entity';
import { PromotionStatus } from './enums/promotion-status.enum';
import { BaseEntity } from './base.entity';

@Entity('promotion')
@Index(['eventId'])
@Index(['code'])
@Index(['isActive'])
@Index(['promotionStatus'])
@Index(['validFrom'])
@Index(['validTo'])
export class Promotion extends BaseEntity{
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'promotion_id' })
  promotionId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: false })
  eventId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'max_discount_amount',
    nullable: true,
  })
  maxDiscountAmount: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'discount_type',
    nullable: true,
  })
  discountType: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'discount_value',
    nullable: true,
  })
  discountValue: number;

  @Column({ type: 'timestamp', name: 'valid_from', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', name: 'valid_to', nullable: true })
  validTo: Date;

  @Column({ type: 'int', name: 'max_uses', nullable: true })
  maxUses: number;

  @Column({ type: 'int', name: 'max_uses_per_user', nullable: true })
  maxUsesPerUser: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'min_purchase_amount',
    nullable: true,
  })
  minPurchaseAmount: number;

  @Column({
    type: 'simple-array',
    name: 'applicable_ticket_categories',
    nullable: true,
  })
  applicableTicketCategories: string[];

  @Column({
    type: 'varchar',
    length: 50,
    name: 'promotion_type',
    nullable: true,
  })
  promotionType: string;

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
  colorName: string;

  @Column({ type: 'varchar', length: 20, name: 'color_code', nullable: true })
  colorCode: string;

  @ManyToOne(() => Event, (event) => event.promotions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
