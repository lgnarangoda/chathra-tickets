import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { ResourcePerson } from './resource-person.entity';
import { BaseEntity } from './base.entity';

@Entity('file')
export class File extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'file_id' })
  fileId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: true })
  eventId: number;

  @Column({ type: 'bigint', name: 'resource_person_id', nullable: true })
  resourcePersonId: number;

  @Column({ type: 'varchar', length: 50, name: 'file_type', nullable: true })
  fileType: string;

  @Column({ type: 'varchar', length: 500, name: 'file_url' })
  fileUrl: string;

  // Note: Reverse relationships are handled automatically by TypeORM
  // through the @ManyToOne relationships in related entities

  @ManyToOne(() => Event, (event) => event.files, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => ResourcePerson, (resourcePerson) => resourcePerson.images, {
    nullable: true,
  })
  @JoinColumn({ name: 'resource_person_id' })
  resourcePerson: ResourcePerson;
}
