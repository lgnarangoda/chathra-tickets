import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../../event/model/eventData.entity';
import { SubEventResourcePerson } from '../../model/sub-event-resource-person.entity';
import { TicketSubEvent } from '../../ticket-category/model/ticket-sub-event.entity';
import { SubEventApprovalStatus } from '../../model/enums/sub-event-approval-status.enum';
import { SubEventStatus } from '../../model/enums/sub-event-status.enum';
import { BaseEntity } from '../../model/base.entity';

@Entity('sub_event')
export class SubEvent extends BaseEntity{
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'sub_event_id' })
  subEventId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: false })
  eventId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'timestamp', name: 'start_time', nullable: true })
  startTime: Date | null;

  @Column({ type: 'timestamp', name: 'end_time', nullable: true })
  endTime: Date | null;

  @Column({ type: 'bigint', name: 'thumbnail_image_id', nullable: true })
  thumbnailImageId: number | null;

  @Column({ type: 'bigint', name: 'cover_image_id', nullable: true })
  coverImageId: number | null;

  @Column({ type: 'simple-array', name: 'image_gallery_ids', nullable: true })
  imageGalleryIds: number[] | null;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'boolean', name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ type: 'bigint', name: 'parent_sub_event_id', nullable: true })
  parentSubEventId: number | null;

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

  @ManyToOne(() => Event, (event) => event.subEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(
    () => SubEventResourcePerson,
    (subEventResourcePerson) => subEventResourcePerson.subEvent,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  resourcePersons: SubEventResourcePerson[];

  @OneToMany(() => TicketSubEvent, (ticketSubEvent) => ticketSubEvent.subEvent, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ticketSubEvents: TicketSubEvent[];
}


