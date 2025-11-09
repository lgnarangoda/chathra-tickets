import { EventMode } from '../enums/event-mode.enum';
import { EventCategory } from '../enums/event-category.enum';
import { EventApprovalStatus } from '../enums/event-approval-status.enum';
import { EventStatus } from '../enums/event-status.enum';
import { BaseDto } from './base.dto';
import type { BookingDto } from './booking.dto';
import type { EventVenueDto } from './event-venue.dto';
import type { FileDto } from './file.dto';
import type { OrganizerDto } from './organizer.dto';
import type { PromotionDto } from './promotion.dto';
import type { SubEventDto } from './sub-event.dto';
import type { TicketCategoryDto } from './ticket-category.dto';

export class EventDto extends BaseDto {
  eventId: number;

  organizerId: number;

  name: string | null;

  eventSlug: string | null;

  description: string | null;

  location: string | null;

  address: string | null;

  country: string | null;

  city: string | null;

  thumbnailImageId: number | null;

  coverImageId: number | null;

  imageGalleryIds: number[] | null;

  startDateTime: Date | null;

  endDateTime: Date | null;

  language: string | null;

  eventMode: EventMode | null;

  eventCategory: EventCategory | null;

  ageLimit: number | null;

  timezone: string | null;

  organizerNotes: string | null;

  bookingTerms: string | null;

  cancellationPolicy: string | null;

  isFeatured: boolean;

  isPublished: boolean;

  isCancelled: boolean;

  maxCapacity: number | null;

  version: number;

  isDraft: boolean;

  parentEventId: number | null;

  approvalStatus: EventApprovalStatus;

  tags: string[] | null;

  status: EventStatus;

  organizer?: OrganizerDto;

  subEvents?: SubEventDto[];

  eventVenues?: EventVenueDto[];

  ticketCategories?: TicketCategoryDto[];

  bookings?: BookingDto[];

  promotions?: PromotionDto[];

  files?: FileDto[];
}

