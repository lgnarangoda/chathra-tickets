import { Controller, Get, Param } from '@nestjs/common';
import { TicketCategoryService } from './ticket-category.service';

@Controller({ path: 'ticket-categories', version: '1' })
export class TicketCategoryController {
	constructor(private readonly service: TicketCategoryService) {}

	@Get(':ticketCategoryId/tickets')
	async tickets(@Param('ticketCategoryId') ticketCategoryId: string) {
		return this.service.listTickets(Number(ticketCategoryId));
	}

	@Get(':ticketCategoryId/sub-events')
	async subEvents(@Param('ticketCategoryId') ticketCategoryId: string) {
		return this.service.listSubEvents(Number(ticketCategoryId));
	}
}


