import { Controller, Get, Param } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller({ path: 'bookings', version: '1' })
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get(':bookingId')
	async getById(@Param('bookingId') bookingId: string) {
		return this.bookingService.findByIdExpanded(Number(bookingId));
	}
}


