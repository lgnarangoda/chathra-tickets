import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';


export class BaseEntity {
  @Column({ type: 'varchar', name: 'created_by', length: 255, nullable: false })
  createdBy: string;

  @CreateDateColumn({
    name: 'created_on',
    type: 'timestamptz',
    nullable: false,
  })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on', type: 'timestamptz' })
  updatedOn: Date;

  @Column({ type: 'varchar', name: 'updated_by', length: 255, nullable: false })
  updatedBy: string;
}
