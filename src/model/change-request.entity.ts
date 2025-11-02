import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Approval } from './approval.entity';
import { EntityType } from './enums/entity-type.enum';
import { ChangeRequestApprovalStatus } from './enums/approval-status.enum';

@Entity('change_request')
export class ChangeRequest {
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

  @CreateDateColumn({ type: 'timestamp', name: 'submitted_at' })
  submittedAt: Date;

  @Column({
    type: 'enum',
    enum: ChangeRequestApprovalStatus,
    name: 'approval_status',
    default: ChangeRequestApprovalStatus.PENDING,
  })
  approvalStatus: ChangeRequestApprovalStatus;

  @Column({ type: 'bigint', name: 'approval_id', nullable: true })
  approvalId: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.changeRequests)
  @JoinColumn({ name: 'submitted_by' })
  submittedBy: User;

  @OneToOne(() => Approval, (approval) => approval.changeRequest)
  @JoinColumn({ name: 'approval_id' })
  approval: Approval;
}
