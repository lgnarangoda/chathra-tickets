import type { FileDto } from './file.dto';
import type { OrganizerDto } from './organizer.dto';
import type { UserDto } from './user.dto';

export class OrganizerDocumentDto {
  id: number;

  organizerId: number;

  fileId: number;

  docType: string | null;

  uploadedAt: Date;

  submittedById: number | null;

  organizer?: OrganizerDto;

  file?: FileDto | null;

  submittedBy?: UserDto | null;
}

