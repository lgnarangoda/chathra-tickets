import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { TicketRequest } from './ticket-request.entity';
import { User } from './user.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 25, unique: true })
  nic: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  telephone: string;

  // Optional inverse relation to User (one-to-one). The owning side is User with customer_id.
  @OneToOne(() => User, (user) => user.customer)
  user?: User;

  // One Customer can have many TicketRequests
  @OneToMany(() => TicketRequest, (ticketRequest) => ticketRequest.customer, {
    cascade: false,
  })
  ticketRequests: TicketRequest[];
}
