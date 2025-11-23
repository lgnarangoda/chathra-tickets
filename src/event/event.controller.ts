import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './model/dto/event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { EventStatus } from '../model/enums/event-status.enum';
import type { FileDto } from '../model/dto/file.dto';
import type { TicketCategoryDto } from '../ticket-category/model/dto/ticket-category.dto';

@Controller({ path: 'events', version: '1' })
export class EventController {
	constructor(private readonly eventService: EventService) {}

	@Post()
	async create(@Body() eventDto: EventDto) {
		return this.eventService.create(eventDto);
	}

	@Get()
	async list(@Query() pagination: PaginationDto) {
		const { page = 1, limit = 20, sort } = pagination;
		return this.eventService.paginate(page, limit, sort);
	}

	@Get(':eventId')
	async getById(@Param('eventId') eventId: string) {
		return this.eventService.findById(Number(eventId));
	}

	@Patch(':eventId/status')
	async updateStatus(
		@Param('eventId') eventId: string,
		@Body() body: { status: EventStatus },
	) {
		return this.eventService.updateStatus(Number(eventId), body.status);
	}

	@Get(':eventId/ticket-categories')
	async ticketCategories(
		@Param('eventId') eventId: string,
		@Query('include') include?: string,
	) {
		const includes = (include ?? '')
			.split(',')
			.map((v) => v.trim())
			.filter(Boolean);
		return this.eventService.listTicketCategoriesByEvent(Number(eventId), includes);
	}

	@Get(':eventId/tickets')
	async tickets(@Param('eventId') eventId: string) {
		return this.eventService.listTicketsByEvent(Number(eventId));
	}

	@Get(':eventId/payments')
	async payments(@Param('eventId') eventId: string) {
		return this.eventService.listPaymentsByEvent(Number(eventId));
	}

	@Get(':eventId/promotions')
	async promotions(@Param('eventId') eventId: string) {
		return this.eventService.listPromotionsByEvent(Number(eventId));
	}

	@Get(':eventId/refunds')
	async refunds(@Param('eventId') eventId: string) {
		return this.eventService.listRefundsByEvent(Number(eventId));
	}

	@Get(':eventId/sub-events')
	async subEvents(@Param('eventId') eventId: string) {
		return this.eventService.listSubEventsByEvent(Number(eventId));
	}

	@Put(':eventId/files-and-ticket-categories')
	async updateFilesAndTicketCategories(
		@Param('eventId') eventId: string,
		@Body() body: { files?: FileDto[]; ticketCategories?: TicketCategoryDto[] },
	) {
		return this.eventService.updateFilesAndTicketCategories(
			Number(eventId),
			body.files,
			body.ticketCategories,
		);
	}
}


