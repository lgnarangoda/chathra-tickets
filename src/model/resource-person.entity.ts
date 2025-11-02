import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { File } from './file.entity';
import { SubEventResourcePerson } from './sub-event-resource-person.entity';
import { ResourcePersonStatus } from './enums/resource-person-status.enum';

@Entity('resource_person')
export class ResourcePerson {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'resource_person_id' })
  resourcePersonId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ResourcePersonStatus,
    default: ResourcePersonStatus.ACTIVE,
  })
  status: ResourcePersonStatus;

  @OneToMany(() => File, (file) => file.resourcePerson)
  images: File[];

  @OneToMany(
    () => SubEventResourcePerson,
    (subEventResourcePerson) => subEventResourcePerson.resourcePerson,
  )
  subEventResourcePersons: SubEventResourcePerson[];
}
