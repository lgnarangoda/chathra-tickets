import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { TicketRequestCategory } from './ticket-request.category.entity';

@Entity()
export class TicketRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  purchase_date: Date;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 25, unique: true })
  code: string;

  // Many TicketRequests belong to one Customer
  @ManyToOne(() => Customer, (customer) => customer.ticketRequests, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // One TicketRequest can have many TicketRequestCategory rows
  @OneToMany(() => TicketRequestCategory, (trc) => trc.ticketRequest, {
    cascade: true,
  })
  categories: TicketRequestCategory[];
}
