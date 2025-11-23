import { EventMode } from '../../../model/enums/event-mode.enum';
import { EventCategory } from '../../../model/enums/event-category.enum';
import { EventApprovalStatus } from '../../../model/enums/event-approval-status.enum';
import { EventStatus } from '../../../model/enums/event-status.enum';
import { BaseDto } from '../../../model/dto/base.dto';
import type { BookingDto } from '../../../booking/model/dto/booking.dto';
import type { EventVenueDto } from '../../../model/dto/event-venue.dto';
import type { FileDto } from '../../../model/dto/file.dto';
import type { OrganizerDto } from '../../../organizer/model/dto/organizer.dto';
import type { PromotionDto } from '../../../promotion/model/dto/promotion.dto';
import type { SubEventDto } from '../../../sub-event/model/dto/sub-event.dto';
import type { TicketCategoryDto } from '../../../ticket-category/model/dto/ticket-category.dto';

export class EventDto extends BaseDto {
  eventId: number;

  organizerId: number;

  name: string;

  eventSlug: string;

  description: string;

  location: string;

  address: string;

  country: string;

  city: string;

  thumbnailImageId: number;

  coverImageId: number;

  imageGalleryIds: number[];

  startDateTime: Date;

  endDateTime: Date;

  language: string;

  eventMode: EventMode;

  eventCategory: EventCategory;

  ageLimit: number;

  timezone: string;

  organizerNotes: string;

  bookingTerms: string;

  cancellationPolicy: string;

  isFeatured: boolean;

  isPublished: boolean;

  isCancelled: boolean;

  maxCapacity: number;

  version: number;

  isDraft: boolean;

  parentEventId: number;

  approvalStatus: EventApprovalStatus;

  tags: string[];

  status: EventStatus;

  organizer?: OrganizerDto;

  subEvents?: SubEventDto[];

  eventVenues?: EventVenueDto[];

  ticketCategories?: TicketCategoryDto[];

  bookings?: BookingDto[];

  promotions?: PromotionDto[];

  files?: FileDto[];
}


