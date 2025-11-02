import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Venue } from './venue.entity';

@Entity('event_venue')
export class EventVenue {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: true })
  eventId: number;

  @Column({ type: 'bigint', name: 'venue_id', nullable: true })
  venueId: number;

  @ManyToOne(() => Event, (event) => event.eventVenues)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Venue, (venue) => venue.eventVenues)
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;
}
