import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Approval } from './approval.entity';
import { EntityType } from './enums/entity-type.enum';
import { ChangeRequestApprovalStatus } from './enums/approval-status.enum';
import { BaseEntity } from './base.entity';

@Entity('change_request')
@Index(['entityType'])
@Index(['submittedById'])
@Index(['approvalStatus'])
export class ChangeRequest extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'change_request_id' })
  changeRequestId: number;

  @Column({
    type: 'enum',
    enum: EntityType,
    name: 'entity_type',
    nullable: true,
  })
  entityType: EntityType;

  @Column({ type: 'bigint', name: 'original_entity_id', nullable: true })
  originalEntityId: number;

  @Column({ type: 'bigint', name: 'draft_entity_id', nullable: true })
  draftEntityId: number;

  @Column({ type: 'bigint', name: 'submitted_by', nullable: true })
  submittedById: number;

  @Column({
    type: 'enum',
    enum: ChangeRequestApprovalStatus,
    name: 'approval_status',
    default: ChangeRequestApprovalStatus.PENDING,
  })
  approvalStatus: ChangeRequestApprovalStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.changeRequests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'submitted_by' })
  submittedBy: User;

  // Inverse relationship - Approval owns the foreign key
  @OneToOne(() => Approval, (approval) => approval.changeRequest)
  approval: Approval;
}
