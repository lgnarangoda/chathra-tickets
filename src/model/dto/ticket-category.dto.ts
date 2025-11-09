import { TicketCategoryStatus } from '../enums/ticket-category-status.enum';
import type { EventDto } from './event.dto';
import type { TicketDto } from './ticket.dto';
import type { TicketSubEventDto } from './ticket-sub-event.dto';

export class TicketCategoryDto {
  ticketCategoryId: number;

  eventId: number;

  name: string | null;

  description: string | null;

  basePrice: number | null;

  maxQuantity: number | null;

  minQuantity: number | null;

  status: TicketCategoryStatus;

  seatMap: string | null;

  event?: EventDto;

  ticketSubEvents?: TicketSubEventDto[];

  tickets?: TicketDto[];
}

