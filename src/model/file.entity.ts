import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organizer } from './organizer.entity';
import { OrganizerDocument } from './organizer-document.entity';
import { Event } from './event.entity';
import { SubEventResourcePerson } from './sub-event-resource-person.entity';
import { ResourcePerson } from './resource-person.entity';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'file_id' })
  fileId: number;

  @Column({ type: 'bigint', name: 'event_id', nullable: true })
  eventId: number;

  @Column({ type: 'bigint', name: 'resource_person_id', nullable: true })
  resourcePersonId: number;

  @Column({ type: 'varchar', length: 50, name: 'file_type', nullable: true })
  fileType: string;

  @CreateDateColumn({ type: 'timestamp', name: 'uploaded_at' })
  uploadedAt: Date;

  @Column({ type: 'varchar', length: 500, name: 'file_url' })
  fileUrl: string;

  @OneToMany(() => Organizer, (organizer) => organizer.profileImage)
  organizersUsingAsProfile: Organizer[];

  @OneToMany(
    () => OrganizerDocument,
    (organizerDocument) => organizerDocument.file,
  )
  organizerDocuments: OrganizerDocument[];

  @OneToMany(
    () => SubEventResourcePerson,
    (subEventResourcePerson) => subEventResourcePerson.profileImageFile,
  )
  subEventResourcePersons: SubEventResourcePerson[];

  @ManyToOne(() => Event, (event) => event.files, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => ResourcePerson, (resourcePerson) => resourcePerson.images, {
    nullable: true,
  })
  @JoinColumn({ name: 'resource_person_id' })
  resourcePerson: ResourcePerson;
}
