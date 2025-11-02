import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { TicketSubEvent } from './ticket-sub-event.entity';
import { Ticket } from './ticket.entity';
import { TicketCategoryStatus } from './enums/ticket-category-status.enum';

@Entity('ticket_category')
export class TicketCategory {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ticket_category_id' })
  ticketCategoryId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: true })
  eventId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'base_price',
    nullable: true,
  })
  basePrice: number;

  @Column({ type: 'int', name: 'max_quantity', nullable: true })
  maxQuantity: number;

  @Column({ type: 'int', name: 'min_quantity', nullable: true })
  minQuantity: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: TicketCategoryStatus.ACTIVE,
  })
  status: TicketCategoryStatus;

  @Column({ type: 'text', name: 'seat_map', nullable: true })
  seatMap: string;

  @ManyToOne(() => Event, (event) => event.ticketCategories)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(
    () => TicketSubEvent,
    (ticketSubEvent) => ticketSubEvent.ticketCategory,
  )
  ticketSubEvents: TicketSubEvent[];

  @OneToMany(() => Ticket, (ticket) => ticket.ticketCategory)
  tickets: Ticket[];
}
