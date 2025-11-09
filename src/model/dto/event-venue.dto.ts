import type { EventDto } from './event.dto';
import type { VenueDto } from '../../venue/model/dto/venue.dto';

export class EventVenueDto {
  id: number;

  eventId: number | null;

  venueId: number | null;

  event?: EventDto | null;

  venue?: VenueDto | null;
}

