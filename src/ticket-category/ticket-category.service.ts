import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../model/ticket.entity';
import { TicketSubEvent } from './model/ticket-sub-event.entity';

@Injectable()
export class TicketCategoryService {
	constructor(
		@InjectRepository(Ticket)
		private readonly ticketRepository: Repository<Ticket>,
		@InjectRepository(TicketSubEvent)
		private readonly ticketSubEventRepository: Repository<TicketSubEvent>,
	) {}

	async listTickets(ticketCategoryId: number) {
		return this.ticketRepository.find({ where: { ticketCategoryId } });
	}

	async listSubEvents(ticketCategoryId: number) {
		return this.ticketSubEventRepository.find({ where: { ticketCategoryId } as any });
	}
}


