import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketCategory } from './ticket-category.entity';
import { SubEvent } from './sub-event.entity';
import { TicketSubEventStatus } from './enums/ticket-sub-event-status.enum';

@Entity('ticket_sub_event')
export class TicketSubEvent {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    type: 'enum',
    enum: TicketSubEventStatus,
    default: TicketSubEventStatus.ACTIVE,
  })
  status: TicketSubEventStatus;

  @Column({ type: 'bigint', name: 'ticket_category_id', nullable: true })
  ticketCategoryId: number;

  @Column({ type: 'bigint', name: 'sub_event_id', nullable: true })
  subEventId: number;

  @ManyToOne(
    () => TicketCategory,
    (ticketCategory) => ticketCategory.ticketSubEvents,
  )
  @JoinColumn({ name: 'ticket_category_id' })
  ticketCategory: TicketCategory;

  @ManyToOne(() => SubEvent, (subEvent) => subEvent.ticketSubEvents)
  @JoinColumn({ name: 'sub_event_id' })
  subEvent: SubEvent;
}
