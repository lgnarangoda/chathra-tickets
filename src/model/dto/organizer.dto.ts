import { OrganizerStatus } from '../enums/organizer-status.enum';
import { BaseDto } from './base.dto';
import type { EventDto } from './event.dto';
import type { FileDto } from './file.dto';
import type { OrganizerDocumentDto } from './organizer-document.dto';

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

