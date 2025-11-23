import { OrganizerStatus } from '../../../model/enums/organizer-status.enum';
import { BaseDto } from '../../../model/dto/base.dto';
import type { EventDto } from '../../../event/model/dto/event.dto';
import type { FileDto } from '../../../model/dto/file.dto';
import type { OrganizerDocumentDto } from '../../../model/dto/organizer-document.dto';

export class OrganizerDto extends BaseDto {
  organizerId: number;

  name: string;

  email: string;

  phone: string | null;

  organizationType: string | null;

  businessType: string | null;

  description: string | null;

  nicOrBrNumber: string | null;

  profileImageId: number | null;

  status: OrganizerStatus;

  profileImage?: FileDto | null;

  documents?: OrganizerDocumentDto[];

  events?: EventDto[];
}


