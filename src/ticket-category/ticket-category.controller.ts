import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TicketCategoryService } from './ticket-category.service';
import { TicketCategoryDto } from './model/dto/ticket-category.dto';

@Controller({ path: 'ticket-categories', version: '1' })
export class TicketCategoryController {
	constructor(private readonly service: TicketCategoryService) {}

	@Post()
	async createTicketCategories(@Body() ticketCategories: TicketCategoryDto[]) {
		return this.service.createTicketCategories(ticketCategories);
	}

	@Get(':ticketCategoryId/tickets')
	async tickets(@Param('ticketCategoryId') ticketCategoryId: string) {
		return this.service.listTickets(Number(ticketCategoryId));
	}

	@Get(':ticketCategoryId/sub-events')	
	async subEvents(@Param('ticketCategoryId') ticketCategoryId: string) {
		return this.service.listSubEvents(Number(ticketCategoryId));
	}
}


