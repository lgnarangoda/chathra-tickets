import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentStatus } from '../../model/enums/payment-status.enum';
import { BaseEntity } from '../../model/base.entity';
import { Booking } from '../../booking/model/booking.entity';
import { Refund } from '../../refund/model/refund.entity';

@Entity('payment')
@Index(['bookingId'])
@Index(['status'])
@Index(['createdOn'])
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'payment_id' })
  paymentId: number;

  @Column({ type: 'bigint', name: 'booking_id', nullable: false })
  bookingId: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'payment_method',
    nullable: true,
  })
  paymentMethod: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'gateway_reference_id',
    nullable: true,
  })
  gatewayReferenceId: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'gateway_name',
    nullable: true,
  })
  gatewayName: string;

  //for one payment there can be only one booking
  @ManyToOne(() => Booking, (booking) => booking.payments, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
  //for one payment there can be only one refund
  @OneToMany(() => Refund, (refund) => refund.payment, {
    cascade: true,
  })
  refunds: Refund[];
}
