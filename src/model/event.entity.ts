import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SeatStatusEnum } from './enums/seat-status.enum';
import { EventTypeEnum } from './enums/event-type.enum';
import { EventStatusEnum } from './enums/event-status.enum';
import { BaseEntity } from './base.entity';
import { Image } from './image.entity';
import { TicketCategory } from './ticket-category.entity';
import { Venue } from './venue.entity';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'enum', enum: SeatStatusEnum })
  type: EventTypeEnum;

  @Column({ type: 'varchar', length: 255 })
  whatzapp: string;

  @Column({ type: 'varchar', length: 255 })
  telephone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'enum', enum: EventStatusEnum })
  status: EventStatusEnum;

  @Column({ name: 'approved_by', type: 'varchar', length: 255 })
  approvedBy: string;

  @Column({ name: 'approved_date', type: 'timestamptz' })
  approvedDate: Date;

  // One event can have multiple images
  @OneToMany(() => Image, (image) => image.event)
  images: Image[];

  // One event can have multiple ticket categories
  @OneToMany(() => TicketCategory, (ticketCategory) => ticketCategory.event)
  ticketCategories: TicketCategory[];

  // One event has one venue (owning side)
  @OneToOne(() => Venue, (venue) => venue.event, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'venue_id', referencedColumnName: 'id' })
  venue: Venue;
}
