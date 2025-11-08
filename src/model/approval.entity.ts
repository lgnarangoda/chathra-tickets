import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChangeRequest } from './change-request.entity';
import { User } from './user.entity';
import { ApprovalStatus } from './enums/approval-status.enum';
import { BaseEntity } from './base.entity';

@Entity('approval')
@Index(['changeRequestId'])
@Index(['approverId'])
@Index(['approvalStatus'])
export class Approval extends BaseEntity{
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'approval_id' })
  approvalId: number;

  @Column({ type: 'bigint', name: 'change_request_id', nullable: true })
  changeRequestId: number;

  @Column({ type: 'bigint', name: 'approver_id', nullable: true })
  approverId: number;

  @Column({ type: 'timestamp', name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    name: 'approval_status',
    default: ApprovalStatus.PENDING,
  })
  approvalStatus: ApprovalStatus;

  @Column({ type: 'text', name: 'approval_notes', nullable: true })
  approvalNotes: string;

  // Approval owns the foreign key to ChangeRequest
  @OneToOne(() => ChangeRequest, (changeRequest) => changeRequest.approval, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'change_request_id' })
  changeRequest: ChangeRequest;

  @ManyToOne(() => User, (user) => user.approvals, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'approver_id' })
  approver: User;
}
