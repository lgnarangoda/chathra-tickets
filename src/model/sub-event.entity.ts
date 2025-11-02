import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { SubEventResourcePerson } from './sub-event-resource-person.entity';
import { TicketSubEvent } from './ticket-sub-event.entity';
import { SubEventApprovalStatus } from './enums/sub-event-approval-status.enum';
import { SubEventStatus } from './enums/sub-event-status.enum';

@Entity('sub_event')
export class SubEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'sub_event_id' })
  subEventId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: true })
  eventId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'timestamp', name: 'start_time', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', name: 'end_time', nullable: true })
  endTime: Date;

  @Column({ type: 'bigint', name: 'thumbnail_image_id', nullable: true })
  thumbnailImageId: number;

  @Column({ type: 'bigint', name: 'cover_image_id', nullable: true })
  coverImageId: number;

  @Column({ type: 'simple-array', name: 'image_gallery_ids', nullable: true })
  imageGalleryIds: number[];

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'boolean', name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ type: 'bigint', name: 'parent_sub_event_id', nullable: true })
  parentSubEventId: number;

  @Column({
    type: 'enum',
    enum: SubEventApprovalStatus,
    name: 'approval_status',
    default: SubEventApprovalStatus.PENDING,
  })
  approvalStatus: SubEventApprovalStatus;

  @Column({
    type: 'enum',
    enum: SubEventStatus,
    default: SubEventStatus.ACTIVE,
  })
  status: SubEventStatus;

  @ManyToOne(() => Event, (event) => event.subEvents)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(
    () => SubEventResourcePerson,
    (subEventResourcePerson) => subEventResourcePerson.subEvent,
  )
  resourcePersons: SubEventResourcePerson[];

  @OneToMany(() => TicketSubEvent, (ticketSubEvent) => ticketSubEvent.subEvent)
  ticketSubEvents: TicketSubEvent[];
}
