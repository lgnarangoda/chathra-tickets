import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { TicketRequest } from './ticket-request.entity';
import { TicketCategory } from './ticket-category.entity';
import { RequestedSeat } from './requested-seat.entity';

@Entity()
export class TicketRequestCategory {
  @PrimaryGeneratedColumn()
  id: number;

  // Many TicketRequestCategory rows belong to one TicketRequest
  @ManyToOne(() => TicketRequest, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_request_id', referencedColumnName: 'id' })
  ticketRequest: TicketRequest;

  // Each row maps to one TicketCategory
  @ManyToOne(() => TicketCategory, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ticket_category_id', referencedColumnName: 'id' })
  ticketCategory: TicketCategory;

  // Optional quantity for this category within the request
  @Column({ type: 'int', nullable: true })
  quantity?: number;

  // One TicketRequestCategory can have multiple RequestedSeat entries
  @OneToMany(() => RequestedSeat, (rs) => rs.ticketRequestCategory, {
    cascade: true,
  })
  requestedSeats: RequestedSeat[];
}
