import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organizer } from './organizer.entity';
import { File } from './file.entity';
import { SubEvent } from './sub-event.entity';
import { EventVenue } from './event-venue.entity';
import { TicketCategory } from './ticket-category.entity';
import { Booking } from './booking.entity';
import { Promotion } from './promotion.entity';
import { EventMode } from './enums/event-mode.enum';
import { EventCategory } from './enums/event-category.enum';
import { EventApprovalStatus } from './enums/event-approval-status.enum';
import { EventStatus } from './enums/event-status.enum';
import { BaseEntity } from './base.entity';

@Entity('event')
@Index(['organizerId'])
@Index(['status'])
@Index(['isPublished'])
@Index(['approvalStatus'])
@Index(['startDateTime'])
@Index(['endDateTime'])
@Index(['organizerId', 'status'])
@Index(['isPublished', 'status'])
export class Event extends BaseEntity{
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'event_id' })
  eventId: number;

  @Column({ type: 'bigint', name: 'organizer_id', nullable: false })
  organizerId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'event_slug',
    nullable: true,
    unique: true,
  })
  eventSlug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'bigint', name: 'thumbnail_image_id', nullable: true })
  thumbnailImageId: number;

  @Column({ type: 'bigint', name: 'cover_image_id', nullable: true })
  coverImageId: number;

  @Column({ type: 'simple-array', name: 'image_gallery_ids', nullable: true })
  imageGalleryIds: number[];

  @Column({ type: 'timestamp', name: 'start_date_time', nullable: true })
  startDateTime: Date;

  @Column({ type: 'timestamp', name: 'end_date_time', nullable: true })
  endDateTime: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({
    type: 'enum',
    enum: EventMode,
    name: 'event_mode',
    nullable: true,
  })
  eventMode: EventMode;

  @Column({
    type: 'enum',
    enum: EventCategory,
    name: 'event_category',
    nullable: true,
  })
  eventCategory: EventCategory;

  @Column({ type: 'int', name: 'age_limit', nullable: true })
  ageLimit: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  timezone: string;

  @Column({ type: 'text', name: 'organizer_notes', nullable: true })
  organizerNotes: string;

  @Column({ type: 'text', name: 'booking_terms', nullable: true })
  bookingTerms: string;

  @Column({ type: 'text', name: 'cancellation_policy', nullable: true })
  cancellationPolicy: string;

  @Column({ type: 'boolean', name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ type: 'boolean', name: 'is_cancelled', default: false })
  isCancelled: boolean;

  @Column({ type: 'int', name: 'max_capacity', nullable: true })
  maxCapacity: number;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'boolean', name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ type: 'bigint', name: 'parent_event_id', nullable: true })
  parentEventId: number;

  @Column({
    type: 'enum',
    enum: EventApprovalStatus,
    name: 'approval_status',
    default: EventApprovalStatus.PENDING,
  })
  approvalStatus: EventApprovalStatus;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.ACTIVE,
  })
  status: EventStatus;

  @ManyToOne(() => Organizer, (organizer) => organizer.events, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'organizer_id' })
  organizer: Organizer;

  @OneToMany(() => SubEvent, (subEvent) => subEvent.event, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  subEvents: SubEvent[];

  @OneToMany(() => EventVenue, (eventVenue) => eventVenue.event, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  eventVenues: EventVenue[];

  @OneToMany(() => TicketCategory, (ticketCategory) => ticketCategory.event, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ticketCategories: TicketCategory[];

  @OneToMany(() => Booking, (booking) => booking.event, {
    onDelete: 'RESTRICT',
  })
  bookings: Booking[];

  @OneToMany(() => Promotion, (promotion) => promotion.event, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  promotions: Promotion[];

  @OneToMany(() => File, (file) => file.event, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  files: File[];
}
