import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { User } from './user.entity';
import { RefundStatus } from './enums/refund-status.enum';

@Entity('refund')
export class Refund {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'refund_id' })
  refundId: number;

  @Column({ type: 'bigint', name: 'payment_id', nullable: true })
  paymentId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'refund_amount',
    nullable: true,
  })
  refundAmount: number;

  @CreateDateColumn({ type: 'timestamp', name: 'refund_time' })
  refundTime: Date;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.INITIATED,
  })
  status: RefundStatus;

  @Column({ type: 'bigint', name: 'refunded_by', nullable: true })
  refundedById: number;
  //one payment one refund
  @ManyToOne(() => Payment, (payment) => payment.refunds)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @ManyToOne(() => User, (user) => user.refunds)
  @JoinColumn({ name: 'refunded_by' })
  refundedBy: User;
}
