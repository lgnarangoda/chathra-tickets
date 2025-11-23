import { BaseDto } from './base.dto';
import type { EventDto } from '../../event/model/dto/event.dto';
import type { ResourcePersonDto } from './resource-person.dto';

export class FileDto extends BaseDto {
  fileId: number;

  eventId: number | null;

  resourcePersonId: number | null;

  fileType: string | null;

  fileUrl: string;

  event?: EventDto | null;

  resourcePerson?: ResourcePersonDto | null;
}

