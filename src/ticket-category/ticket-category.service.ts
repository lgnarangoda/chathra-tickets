import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../model/ticket.entity';
import { TicketSubEvent } from './model/ticket-sub-event.entity';
import { TicketCategory } from './model/ticket-category.entity';
import { TicketCategoryDto } from './model/dto/ticket-category.dto';
import { TicketCategoryStatus } from '../model/enums/ticket-category-status.enum';

@Injectable()
export class TicketCategoryService {
	constructor(
		@InjectRepository(TicketCategory)
		private readonly ticketCategoryRepository: Repository<TicketCategory>,
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

	async createTicketCategories(ticketCategoryDtos: TicketCategoryDto[]): Promise<TicketCategory[]> {
		const ticketCategories = ticketCategoryDtos.map((dto) =>
			this.ticketCategoryRepository.create({
				eventId: dto.eventId,
				name: dto.name ?? null,
				description: dto.description ?? null,
				basePrice: dto.basePrice ?? null,
				maxQuantity: dto.maxQuantity ?? null,
				minQuantity: dto.minQuantity ?? null,
				status: dto.status ?? TicketCategoryStatus.ACTIVE,
				seatMap: dto.seatMap ?? null,
			} as Partial<TicketCategory>),
		);

		return await this.ticketCategoryRepository.save(ticketCategories);
	}
}


