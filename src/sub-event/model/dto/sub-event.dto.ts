import { SubEventApprovalStatus } from '../../../model/enums/sub-event-approval-status.enum';
import { SubEventStatus } from '../../../model/enums/sub-event-status.enum';
import { BaseDto } from '../../../model/dto/base.dto';
import type { EventDto } from '../../../event/model/dto/event.dto';
import type { SubEventResourcePersonDto } from '../../../model/dto/sub-event-resource-person.dto';
import type { TicketSubEventDto } from '../../../ticket-category/model/dto/ticket-sub-event.dto';

export class SubEventDto extends BaseDto {
  subEventId: number;

  eventId: number;

  name: string | null;

  startTime: Date | null;

  endTime: Date | null;

  thumbnailImageId: number | null;

  coverImageId: number | null;

  imageGalleryIds: number[] | null;

  version: number;

  isDraft: boolean;

  parentSubEventId: number | null;

  approvalStatus: SubEventApprovalStatus;

  status: SubEventStatus;

  event?: EventDto;

  resourcePersons?: SubEventResourcePersonDto[];

  ticketSubEvents?: TicketSubEventDto[];
}


