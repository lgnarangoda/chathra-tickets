import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';
import { Ticket } from './ticket.entity';
import { Payment } from './payment.entity';
import { BookingStatus } from './enums/booking-status.enum';
import { BookingPaymentStatus } from './enums/payment-status.enum';
import { BaseEntity } from './base.entity';

@Entity('booking')
@Index(['userId'])
@Index(['eventId'])
@Index(['status'])
@Index(['paymentStatus'])
@Index(['createdOn'])
@Index(['userId', 'status'])
@Index(['eventId', 'status'])
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'booking_id' })
  bookingId: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: false })
  eventId: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @Column({ type: 'boolean', name: 'is_test', default: false })
  isTest: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referrer: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_amount',
    nullable: true,
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: BookingPaymentStatus,
    name: 'payment_status',
    default: BookingPaymentStatus.ACTIVE,
  })
  paymentStatus: BookingPaymentStatus;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => Ticket, (ticket) => ticket.booking, {
    cascade: true,
  })
  tickets: Ticket[];

  @OneToMany(() => Payment, (payment) => payment.booking, {
    cascade: true,
  })
  payments: Payment[];
}
