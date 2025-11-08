import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organizer } from './organizer.entity';
import { File } from './file.entity';
import { User } from './user.entity';

@Entity('organizer_document')
export class OrganizerDocument {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'organizer_id' })
  organizerId: number;

  @Column({ type: 'bigint', name: 'file_id' })
  fileId: number;

  @Column({ type: 'varchar', length: 50, name: 'doc_type', nullable: true })
  docType: string;

  @CreateDateColumn({ type: 'timestamp', name: 'uploaded_at' })
  uploadedAt: Date;

  @Column({ type: 'bigint', name: 'submitted_by', nullable: true })
  submittedById: number;

  @ManyToOne(() => Organizer, (organizer) => organizer.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizer_id' })
  organizer: Organizer;

  @ManyToOne(() => File, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'file_id' })
  file: File;

  @ManyToOne(() => User, (user) => user.submittedDocuments, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'submitted_by' })
  submittedBy: User;
}
