import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChangeRequest } from './change-request.entity';
import { User } from './user.entity';
import { ApprovalStatus } from './enums/approval-status.enum';

@Entity('approval')
export class Approval {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'approval_id' })
  approvalId: number;

  @Column({ type: 'bigint', name: 'change_request_id', nullable: true })
  changeRequestId: number;

  @Column({ type: 'bigint', name: 'approver_id', nullable: true })
  approverId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'approved_at' })
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

  @OneToOne(() => ChangeRequest, (changeRequest) => changeRequest.approval)
  @JoinColumn({ name: 'change_request_id' })
  changeRequest: ChangeRequest;

  //ont to one
  @ManyToOne(() => User, (user) => user.approvals)
  @JoinColumn({ name: 'approver_id' })
  approver: User;
}
