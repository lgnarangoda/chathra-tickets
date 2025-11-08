import {
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export class BaseEntity {
  @ManyToOne(() => User, (user) => user.promotions, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({
    name: 'created_on',
    type: 'timestamptz',
    nullable: false,
  })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on', type: 'timestamptz' })
  updatedOn: Date;

  @ManyToOne(() => User, (user) => user.promotions, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: string;
}
