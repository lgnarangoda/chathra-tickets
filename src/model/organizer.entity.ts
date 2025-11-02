import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';
import { OrganizerDocument } from './organizer-document.entity';
import { Event } from './event.entity';
import { OrganizerStatus } from './enums/organizer-status.enum';

@Entity('organizer')
export class Organizer {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'organizer_id' })
  organizerId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'organization_type',
    nullable: true,
  })
  organizationType: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'business_type',
    nullable: true,
  })
  businessType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'nic_or_br_number',
    nullable: true,
  })
  nicOrBrNumber: string;

  @Column({ type: 'bigint', name: 'profile_image_id', nullable: true })
  profileImageId: number;

  @Column({
    type: 'enum',
    enum: OrganizerStatus,
    default: OrganizerStatus.ACTIVE,
  })
  status: OrganizerStatus;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'profile_image_id' })
  profileImage: File;

  @OneToMany(() => OrganizerDocument, (doc) => doc.organizer)
  documents: OrganizerDocument[];

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];
}
