import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SeatStatusEnum } from './enums/seat-status.enum';
import { TicketCategory } from './ticket-category.entity';

@Entity()
export class EventSeatStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => TicketCategory,
    (ticketCategory) => ticketCategory.eventSeatStatuses,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'ticket_category_id', referencedColumnName: 'id' })
  ticketCategory: TicketCategory;

  @Column({ name: 'seat_code', type: 'varchar', length: 255, nullable: false })
  seatCode: string;

  @Column({ type: 'enum', enum: SeatStatusEnum, nullable: false })
  status: SeatStatusEnum;
}
