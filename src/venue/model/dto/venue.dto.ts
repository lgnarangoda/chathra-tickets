import { VenueStatus } from '../../../model/enums/venue-status.enum';
import type { EventVenueDto } from '../../../model/dto/event-venue.dto';

export class VenueDto {
  venueId?: number;

  name?: string;

  address?: string;

  city?: string;

  country?: string;

  zip?: string;

  latitude?: number;

  longitude?: number;

  venueType?: string;

  isParkingAvailable?: boolean;

  seatMap?: any;

  status?: VenueStatus;

  eventVenues?: EventVenueDto[];
}

