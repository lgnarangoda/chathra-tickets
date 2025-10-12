import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TicketRequestCategory } from './ticket-request.category.entity';
import { EventSeatStatus } from './event-seat-status.entity';

@Entity()
export class RequestedSeat {
  @PrimaryGeneratedColumn()
  id: number;

  // Optional local code representation (e.g., short seat code); kept to avoid breaking existing usage
  @Column({ type: 'varchar', length: 5, unique: true, nullable: false })
  code: string;

  // Many requested seats belong to one ticket-request-category
  @ManyToOne(() => TicketRequestCategory, (trc) => trc.requestedSeats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'ticket_request_category_id',
    referencedColumnName: 'id',
  })
  ticketRequestCategory: TicketRequestCategory;

  // Each requested seat maps to exactly one event seat status, and each event seat status can be linked to at most one requested seat (one-to-one)
  @OneToOne(() => EventSeatStatus, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'event_seat_status_id', referencedColumnName: 'id' })
  eventSeatStatus: EventSeatStatus;
}
