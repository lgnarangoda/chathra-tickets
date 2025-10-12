import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ImageTypeEnum } from './enums/image-type.enum';
import { Event } from './event.entity';
@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  @Column({ type: 'enum', enum: ImageTypeEnum })
  type: ImageTypeEnum;

  // Many images belong to one event
  @ManyToOne(() => Event, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;
}
