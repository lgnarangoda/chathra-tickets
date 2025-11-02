import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { OrganizerDocument } from './organizer-document.entity';
import { ChangeRequest } from './change-request.entity';
import { Ticket } from './ticket.entity';
import { Booking } from './booking.entity';
import { Refund } from './refund.entity';
import { Promotion } from './promotion.entity';
import { Approval } from './approval.entity';
import { UserStatus } from './enums/user-status.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'boolean', name: 'is_guest', default: false })
  isGuest: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => OrganizerDocument, (doc) => doc.submittedBy)
  submittedDocuments: OrganizerDocument[];

  @OneToMany(() => ChangeRequest, (changeRequest) => changeRequest.submittedBy)
  changeRequests: ChangeRequest[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Refund, (refund) => refund.refundedBy)
  refunds: Refund[];

  @OneToMany(() => Promotion, (promotion) => promotion.createdBy)
  promotions: Promotion[];

  @OneToMany(() => Approval, (approval) => approval.approver)
  approvals: Approval[];
}
