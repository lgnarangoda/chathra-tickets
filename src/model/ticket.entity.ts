import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketCategory } from './ticket-category.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { TicketStatus } from './enums/ticket-status.enum';
import { BaseEntity } from './base.entity';

@Entity('ticket')
@Index(['bookingId'])
@Index(['userId'])
@Index(['ticketCategoryId'])
@Index(['status'])
@Index(['ticketNumber'])
@Index(['bookingId', 'status'])
@Index(['userId', 'status'])
export class Ticket extends BaseEntity{
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ticket_id' })
  ticketId: number;

  @Column({ type: 'bigint', name: 'ticket_category_id', nullable: false })
  ticketCategoryId: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 500, name: 'qr_code_url', nullable: true })
  qrCodeUrl: string;

  @Column({ type: 'varchar', length: 100, name: 'ticket_number', nullable: true, unique: true })
  ticketNumber: string;

  @Column({ type: 'boolean', name: 'is_checked_in', default: false })
  isCheckedIn: boolean;

  @Column({ type: 'bigint', name: 'booking_id', nullable: false })
  bookingId: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.VALID,
  })
  status: TicketStatus;


  @ManyToOne(() => TicketCategory, (ticketCategory) => ticketCategory.tickets, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ticket_category_id' })
  ticketCategory: TicketCategory;

  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Booking, (booking) => booking.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}

