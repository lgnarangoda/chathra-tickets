import { ResourcePersonStatus } from '../enums/resource-person-status.enum';
import type { FileDto } from './file.dto';
import type { SubEventResourcePersonDto } from './sub-event-resource-person.dto';

export class ResourcePersonDto {
  resourcePersonId: number;

  name: string | null;

  description: string | null;

  status: ResourcePersonStatus;

  images?: FileDto[];

  subEventResourcePersons?: SubEventResourcePersonDto[];
}

