import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './model/booking.entity';

@Injectable()
export class BookingService {
	constructor(
		@InjectRepository(Booking)
		private readonly bookingRepository: Repository<Booking>,
	) {}

	async findByIdExpanded(bookingId: number) {
		return this.bookingRepository.findOne({
			where: { bookingId },
			relations: ['tickets', 'tickets.ticketCategory'],
		});
	}
}


