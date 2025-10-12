import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  username: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  role: string;

  // Optional one-to-one link to a Customer. Keeping it nullable for backward compatibility.
  @OneToOne(() => Customer, (customer) => customer.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer?: Customer;
}
