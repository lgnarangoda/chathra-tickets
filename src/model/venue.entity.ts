import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @Column({ name: 'seat_map_json', type: 'text' })
  seatMapJson: string;

  // One venue is associated with one event (inverse side)
  @OneToOne(() => Event, (event) => event.venue)
  event: Event;
}
