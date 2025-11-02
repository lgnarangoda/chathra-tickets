import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubEvent } from './sub-event.entity';
import { ResourcePerson } from './resource-person.entity';
import { File } from './file.entity';

@Entity('sub_event_resource_person')
export class SubEventResourcePerson {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'sub_event_id', nullable: true })
  subEventId: number;

  @Column({ type: 'bigint', name: 'resource_person_id', nullable: true })
  resourcePersonId: number;

  @Column({ type: 'bigint', name: 'profile_image', nullable: true })
  profileImage: number;

  @Column({ type: 'simple-array', name: 'image_gallery_ids', nullable: true })
  imageGalleryIds: number[];

  @ManyToOne(() => SubEvent, (subEvent) => subEvent.resourcePersons)
  @JoinColumn({ name: 'sub_event_id' })
  subEvent: SubEvent;

  @ManyToOne(
    () => ResourcePerson,
    (resourcePerson) => resourcePerson.subEventResourcePersons,
  )
  @JoinColumn({ name: 'resource_person_id' })
  resourcePerson: ResourcePerson;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'profile_image' })
  profileImageFile: File;
}
