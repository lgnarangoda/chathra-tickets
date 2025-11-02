import {
  Column,
  CreateDateColumn,
  Entity,
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

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'booking_id' })
  bookingId: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: true })
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
  // created date time
  @CreateDateColumn({ type: 'timestamp', name: 'booking_time' })
  bookingTime: Date;

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

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];
}
