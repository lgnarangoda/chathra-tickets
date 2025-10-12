import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { SeatTypeEnum } from './enums/seat-type.enum';
import { EventSeatStatus } from './event-seat-status.entity';
import { TicketRequestCategory } from './ticket-request.category.entity';
import { Event } from './event.entity';

@Entity()
export class TicketCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @Column({ type: 'bigint', nullable: false })
  value: number;

  @Column({ type: 'bigint' })
  count: number;

  @Column({ type: 'enum', enum: SeatTypeEnum, nullable: false })
  status: SeatTypeEnum;

  @Column({ name: 'color_code', type: 'varchar', length: 255 })
  colorCode: string;

  // Many TicketCategories belong to one Event
  @ManyToOne(() => Event, (event) => event.ticketCategories, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;

  @OneToMany(
    () => EventSeatStatus,
    (eventSeatStatus) => eventSeatStatus.ticketCategory,
    { cascade: true },
  )
  eventSeatStatuses: EventSeatStatus[];

  // One TicketCategory can be referenced in many TicketRequestCategory rows
  @OneToMany(() => TicketRequestCategory, (trc) => trc.ticketCategory)
  ticketRequestCategories: TicketRequestCategory[];
}
