import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventVenue } from '../../model/event-venue.entity';
import { VenueStatus } from '../../model/enums/venue-status.enum';

@Entity('venue')
export class Venue {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'venue_id' })
  venueId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zip: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 100, name: 'venue_type', nullable: true })
  venueType: string;

  @Column({ type: 'boolean', name: 'is_parking_available', default: false })
  isParkingAvailable: boolean;

  @Column({ type: 'json', name: 'seat_map', nullable: true })
  seatMap: any;

  @Column({
    type: 'enum',
    enum: VenueStatus,
    default: VenueStatus.ACTIVE,
  })
  status: VenueStatus;

  @OneToMany(() => EventVenue, (eventVenue) => eventVenue.venue)
  eventVenues: EventVenue[];
}
