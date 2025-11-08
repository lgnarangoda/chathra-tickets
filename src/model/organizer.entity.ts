import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';
import { OrganizerDocument } from './organizer-document.entity';
import { Event } from './event.entity';
import { OrganizerStatus } from './enums/organizer-status.enum';
import { BaseEntity } from './base.entity';

@Entity('organizer')
@Index(['email'])
@Index(['phone'])
@Index(['status'])
@Index(['nicOrBrNumber'])
export class Organizer extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'organizer_id' })
  organizerId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
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
    unique: true,
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

  @ManyToOne(() => File, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profile_image_id' })
  profileImage: File;

  @OneToMany(() => OrganizerDocument, (doc) => doc.organizer, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  documents: OrganizerDocument[];

  @OneToMany(() => Event, (event) => event.organizer, {
    onDelete: 'RESTRICT',
  })
  events: Event[];
}
