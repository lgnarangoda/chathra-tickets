import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TicketCategory } from './ticket-category.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { TicketStatus } from './enums/ticket-status.enum';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ticket_id' })
  ticketId: number;

  @Column({ type: 'bigint', name: 'ticket_category_id', nullable: true })
  ticketCategoryId: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'varchar', length: 500, name: 'qr_code_url', nullable: true })
  qrCodeUrl: string;

  @Column({ type: 'varchar', length: 100, name: 'ticket_number', nullable: true, unique: true })
  ticketNumber: string;

  @Column({ type: 'boolean', name: 'is_checked_in', default: false })
  isCheckedIn: boolean;

  @Column({ type: 'bigint', name: 'booking_id', nullable: true })
  bookingId: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.VALID,
  })
  status: TicketStatus;

  @ManyToOne(() => TicketCategory, (ticketCategory) => ticketCategory.tickets)
  @JoinColumn({ name: 'ticket_category_id' })
  ticketCategory: TicketCategory;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Booking, (booking) => booking.tickets)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}

