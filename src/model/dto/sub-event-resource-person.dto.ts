import type { FileDto } from './file.dto';
import type { ResourcePersonDto } from './resource-person.dto';
import type { SubEventDto } from './sub-event.dto';

export class SubEventResourcePersonDto {
  id: number;

  subEventId: number | null;

  resourcePersonId: number | null;

  profileImage: number | null;

  imageGalleryIds: number[] | null;

  subEvent?: SubEventDto | null;

  resourcePerson?: ResourcePersonDto | null;

  profileImageFile?: FileDto | null;
}

