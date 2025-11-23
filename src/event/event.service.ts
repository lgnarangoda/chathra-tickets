import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventData } from './model/eventData.entity';
import { EventStatus } from '../model/enums/event-status.enum';
import { EventDto } from './model/dto/event.dto';
import type { TicketCategoryDto } from '../ticket-category/model/dto/ticket-category.dto';
import type { SubEventDto } from '../sub-event/model/dto/sub-event.dto';
import type { EventVenueDto } from '../model/dto/event-venue.dto';
import type { PromotionDto } from '../promotion/model/dto/promotion.dto';
import type { FileDto } from '../model/dto/file.dto';
import { TicketCategory } from '../ticket-category/model/ticket-category.entity';
import { Ticket } from '../model/ticket.entity';
import { Payment } from '../payment/model/payment.entity';
import { Promotion } from '../promotion/model/promotion.entity';
import { Refund } from '../refund/model/refund.entity';
import { SubEvent } from '../sub-event/model/sub-event.entity';
import { EventVenue } from '../model/event-venue.entity';
import { File } from '../model/file.entity';
import {
	NotFoundException,
	DatabaseException,
	BadRequestException,
} from '../common/exceptions/custom-exceptions';

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>,
		@InjectRepository(TicketCategory)
		private readonly ticketCategoryRepository: Repository<TicketCategory>,
		@InjectRepository(Ticket)
		private readonly ticketRepository: Repository<Ticket>,
		@InjectRepository(Payment)
		private readonly paymentRepository: Repository<Payment>,
		@InjectRepository(Promotion)
		private readonly promotionRepository: Repository<Promotion>,
		@InjectRepository(Refund)
		private readonly refundRepository: Repository<Refund>,
		@InjectRepository(SubEvent)
		private readonly subEventRepository: Repository<SubEvent>,
		@InjectRepository(EventVenue)
		private readonly eventVenueRepository: Repository<EventVenue>,
		@InjectRepository(File)
		private readonly fileRepository: Repository<File>,
	) {}

	/**
	 * Helper function to convert null values to undefined for DeepPartial compatibility
	 */
	private nullToUndefined<T>(value: T): T extends null ? undefined : T {
		if (value === null) {
			return undefined as T extends null ? undefined : T;
		}
		if (Array.isArray(value)) {
			return value.map(item => this.nullToUndefined(item)) as T extends null ? undefined : T;
		}
		if (value && typeof value === 'object') {
			return Object.fromEntries(
				Object.entries(value).map(([key, val]) => [key, this.nullToUndefined(val)])
			) as T extends null ? undefined : T;
		}
		return value as T extends null ? undefined : T;
	}

	/**
	 * Converts null values to undefined in an object for DeepPartial compatibility
	 */
	private processDataForDeepPartial(data: Record<string, any>): Record<string, any> {
		return Object.fromEntries(
			Object.entries(data).map(([key, value]) => [key, this.nullToUndefined(value)])
		);
	}

	/**
	 * Maps TicketCategoryDto[] to TicketCategory entities
	 */
	private mapTicketCategories(dtos?: TicketCategoryDto[]): TicketCategory[] | undefined {
		if (!dtos) return undefined;
		return dtos.map((dto) =>
			this.ticketCategoryRepository.create({
				ticketCategoryId: dto.ticketCategoryId ?? undefined,
				eventId: dto.eventId ?? undefined,
				name: dto.name ?? undefined,
				description: dto.description ?? undefined,
				basePrice: dto.basePrice ?? undefined,
				maxQuantity: dto.maxQuantity ?? undefined,
				minQuantity: dto.minQuantity ?? undefined,
				status: dto.status ?? undefined,
				seatMap: dto.seatMap ?? undefined,
			}),
		);
	}

	/**
	 * Maps SubEventDto[] to SubEvent entities
	 */
	private mapSubEvents(dtos?: SubEventDto[]): SubEvent[] | undefined {
		if (!dtos) return undefined;
		return dtos.map((dto) =>
			this.subEventRepository.create({
				subEventId: dto.subEventId ?? undefined,
				eventId: dto.eventId ?? undefined,
				name: dto.name ?? undefined,
				startTime: dto.startTime ?? undefined,
				endTime: dto.endTime ?? undefined,
				thumbnailImageId: dto.thumbnailImageId ?? undefined,
				coverImageId: dto.coverImageId ?? undefined,
				imageGalleryIds: dto.imageGalleryIds ?? undefined,
				version: dto.version ?? 1,
				isDraft: dto.isDraft ?? false,
				parentSubEventId: dto.parentSubEventId ?? undefined,
				approvalStatus: dto.approvalStatus ?? undefined,
				status: dto.status ?? undefined,
			}),
		);
	}

	/**
	 * Maps EventVenueDto[] to EventVenue entities
	 */
	private mapEventVenues(dtos?: EventVenueDto[]): EventVenue[] | undefined {
		if (!dtos) return undefined;
		return dtos.map((dto) =>
			this.eventVenueRepository.create({
				id: dto.id ?? undefined,
				eventId: dto.eventId ?? undefined,
				venueId: dto.venueId ?? undefined,
			}),
		);
	}

	/**
	 * Maps PromotionDto[] to Promotion entities
	 */
	private mapPromotions(dtos?: PromotionDto[]): Promotion[] | undefined {
		if (!dtos) return undefined;
		return dtos.map((dto) =>
			this.promotionRepository.create({
				promotionId: dto.promotionId ?? undefined,
				eventId: dto.eventId ?? undefined,
				name: dto.name ?? undefined,
				code: dto.code ?? undefined,
				maxDiscountAmount: dto.maxDiscountAmount ?? undefined,
				discountType: dto.discountType ?? undefined,
				discountValue: dto.discountValue ?? undefined,
				validFrom: dto.validFrom ?? undefined,
				validTo: dto.validTo ?? undefined,
				maxUses: dto.maxUses ?? undefined,
				maxUsesPerUser: dto.maxUsesPerUser ?? undefined,
				minPurchaseAmount: dto.minPurchaseAmount ?? undefined,
				applicableTicketCategories: dto.applicableTicketCategories ?? undefined,
				promotionType: dto.promotionType ?? undefined,
				promotionStatus: dto.promotionStatus ?? undefined,
				isStackable: dto.isStackable ?? false,
				isActive: dto.isActive ?? true,
				colorName: dto.colorName ?? undefined,
				colorCode: dto.colorCode ?? undefined,
			}),
		);
	}

	/**
	 * Maps FileDto[] to File entities
	 */
	private mapFiles(dtos?: FileDto[]): File[] | undefined {
		if (!dtos) return undefined;
		return dtos.map((dto) =>
			this.fileRepository.create({
				fileId: dto.fileId ?? undefined,
				eventId: dto.eventId ?? undefined,
				resourcePersonId: dto.resourcePersonId ?? undefined,
				fileType: dto.fileType ?? undefined,
				fileUrl: dto.fileUrl ?? undefined,
			}),
		);
	}

	async create(eventDto: EventDto): Promise<EventData> {
		try {
			const {
				eventId,
				version,
				isDraft,
				approvalStatus,
				status,
				bookings,
				promotions,
				files,
				subEvents,
				eventVenues,
				ticketCategories,
				organizer,
				...data
			} = eventDto;

			// Convert null values to undefined in data object
			const processedData = this.processDataForDeepPartial(data);

			// Map DTOs to entities
			const ticketCategoryEntities = this.mapTicketCategories(eventDto.ticketCategories);
			const subEventEntities = this.mapSubEvents(eventDto.subEvents);
			const eventVenueEntities = this.mapEventVenues(eventDto.eventVenues);
			const promotionEntities = this.mapPromotions(eventDto.promotions);
			const fileEntities = this.mapFiles(eventDto.files);

			const payload = {
				...processedData,
				isDraft: eventDto.isDraft ?? false,
				isFeatured: eventDto.isFeatured ?? false,
				isPublished: eventDto.isPublished ?? false,
				isCancelled: eventDto.isCancelled ?? false,
				version: eventDto.version ?? 1,
				status: (status ?? EventStatus.ACTIVE) ?? undefined,
				ticketCategories: ticketCategoryEntities ?? undefined,
				subEvents: subEventEntities ?? undefined,
				eventVenues: eventVenueEntities ?? undefined,
				promotions: promotionEntities ?? undefined,
				files: fileEntities ?? undefined,
			};

			const eventData = this.eventRepository.create(payload);
			return await this.eventRepository.save(eventData);
		} catch (error: any) {
			if (error.code === '23505') {
				// PostgreSQL unique violation
				throw new BadRequestException(
					'An event with this identifier already exists',
					{ field: 'eventSlug' },
				);
			}
			if (error.code === '23503') {
				// PostgreSQL foreign key violation
				throw new BadRequestException(
					'Invalid reference: One or more related resources do not exist',
					{ constraint: error.constraint },
				);
			}
			throw new DatabaseException(
				'Failed to create event',
				error,
			);
		}
	}

	async findById(eventId: number): Promise<EventData> {
		const event = await this.eventRepository.findOne({
			where: { eventId },
		});

		if (!event) {
			throw new NotFoundException('Event', eventId);
		}

		return event;
	}

	async paginate(page: number, limit: number, sort?: string) {
		const skip = (page - 1) * limit;
		const order: Record<string, 'ASC' | 'DESC'> = {};
		if (sort) {
			const [field, direction] = sort.split(':');
			order[field] = (direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
		} else {
			order['eventId'] = 'DESC';
		}
		const [items, total] = await this.eventRepository.findAndCount({
			take: limit,
			skip,
			order,
		});
		return {
			items,
			page,
			limit,
			total,
			nextPage: page * limit < total ? page + 1 : null,
		};
	}

	async updateStatus(eventId: number, status: EventStatus): Promise<EventData> {
		try {
			const eventData = await this.eventRepository.findOneOrFail({
				where: { eventId },
			});
			eventData.status = status;
			return await this.eventRepository.save(eventData);
		} catch (error: any) {
			if (error.name === 'EntityNotFoundError') {
				throw new NotFoundException('Event', eventId);
			}
			throw new DatabaseException(
				'Failed to update event status',
				error,
			);
		}
	}

	async listTicketCategoriesByEvent(eventId: number, include: string[] = []) {
		const relations: string[] = [];
		if (include.includes('tickets')) {
			relations.push('tickets');
		}
		if (include.includes('subEvents') || include.includes('ticketSubEvents')) {
			relations.push('ticketSubEvents');
		}
		return this.ticketCategoryRepository.find({
			where: { eventId },
			relations,
		});
	}

	async listTicketsByEvent(eventId: number) {
		return this.ticketRepository
			.createQueryBuilder('ticket')
			.innerJoin('ticket.booking', 'booking')
			.where('booking.eventId = :eventId', { eventId })
			.getMany();
	}

	async listPaymentsByEvent(eventId: number) {
		return this.paymentRepository
			.createQueryBuilder('payment')
			.innerJoin('payment.booking', 'booking')
			.where('booking.eventId = :eventId', { eventId })
			.getMany();
	}

	async listPromotionsByEvent(eventId: number) {
		return this.promotionRepository.find({
			where: { eventId },
		});
	}

	async listRefundsByEvent(eventId: number) {
		return this.refundRepository
			.createQueryBuilder('refund')
			.innerJoin('refund.payment', 'payment')
			.innerJoin('payment.booking', 'booking')
			.where('booking.eventId = :eventId', { eventId })
			.getMany();
	}

	async listSubEventsByEvent(eventId: number) {
		return this.subEventRepository.find({
			where: { eventId },
		});
	}

	async updateFilesAndTicketCategories(
		eventId: number,
		files?: FileDto[],
		ticketCategories?: TicketCategoryDto[],
	): Promise<EventData> {
		try {
			const event = await this.eventRepository.findOne({
				where: { eventId },
				relations: ['files', 'ticketCategories'],
			});

			if (!event) {
				throw new NotFoundException('Event', eventId);
			}

			// Update or create files
			if (files !== undefined) {
				const fileEntities = this.mapFiles(files);
				if (fileEntities) {
					// Set eventId for all files
					fileEntities.forEach((file) => {
						file.eventId = eventId;
					});
					// Remove existing files and save new ones
					if (event.files) {
						await this.fileRepository.remove(event.files);
					}
					event.files = await this.fileRepository.save(fileEntities);
				} else {
					// If files is empty array, remove all files
					if (event.files && event.files.length > 0) {
						await this.fileRepository.remove(event.files);
						event.files = [];
					}
				}
			}

			// Update or create ticket categories
			if (ticketCategories !== undefined) {
				const ticketCategoryEntities = this.mapTicketCategories(ticketCategories);
				if (ticketCategoryEntities) {
					// Set eventId for all ticket categories
					ticketCategoryEntities.forEach((category) => {
						category.eventId = eventId;
					});
					// Remove existing ticket categories and save new ones
					if (event.ticketCategories) {
						await this.ticketCategoryRepository.remove(event.ticketCategories);
					}
					event.ticketCategories = await this.ticketCategoryRepository.save(
						ticketCategoryEntities,
					);
				} else {
					// If ticketCategories is empty array, remove all ticket categories
					if (event.ticketCategories && event.ticketCategories.length > 0) {
						await this.ticketCategoryRepository.remove(event.ticketCategories);
						event.ticketCategories = [];
					}
				}
			}

			// Reload event with relations
			const updatedEvent = await this.eventRepository.findOne({
				where: { eventId },
				relations: ['files', 'ticketCategories'],
			});

			if (!updatedEvent) {
				throw new NotFoundException('Event', eventId);
			}

			return updatedEvent;
		} catch (error: any) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			if (error.code === '23503') {
				// PostgreSQL foreign key violation
				throw new BadRequestException(
					'Invalid reference: One or more related resources do not exist',
					{ constraint: error.constraint },
				);
			}
			throw new DatabaseException(
				'Failed to update event files and ticket categories',
				error,
			);
		}
	}
}


