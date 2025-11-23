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
import { Payment } from '../../payment/model/payment.entity';
import { User } from '../../model/user.entity';
import { RefundStatus } from '../../model/enums/refund-status.enum';

@Entity('refund')
@Index(['paymentId'])
@Index(['status'])
@Index(['refundedById'])
export class Refund {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'refund_id' })
  refundId: number;

  @Column({ type: 'bigint', name: 'payment_id', nullable: false })
  paymentId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'refund_amount',
    nullable: true,
  })
  refundAmount: number | null;

  @CreateDateColumn({ type: 'timestamp', name: 'refund_time' })
  refundTime: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.INITIATED,
  })
  status: RefundStatus;

  @Column({ type: 'bigint', name: 'refunded_by', nullable: true })
  refundedById: number | null;
  @ManyToOne(() => Payment, (payment) => payment.refunds, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @ManyToOne(() => User, (user) => user.refunds, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'refunded_by' })
  refundedBy: User | null;
}


