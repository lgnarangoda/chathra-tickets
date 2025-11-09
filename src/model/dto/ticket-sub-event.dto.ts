import { TicketSubEventStatus } from '../enums/ticket-sub-event-status.enum';
import type { SubEventDto } from './sub-event.dto';
import type { TicketCategoryDto } from './ticket-category.dto';

export class TicketSubEventDto {
  id: number;

  status: TicketSubEventStatus;

  ticketCategoryId: number | null;

  subEventId: number | null;

  ticketCategory?: TicketCategoryDto | null;

  subEvent?: SubEventDto | null;
}

