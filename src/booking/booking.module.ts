import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './model/booking.entity';
import { Ticket } from '../model/ticket.entity';
import { TicketCategory } from '../ticket-category/model/ticket-category.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
	imports: [TypeOrmModule.forFeature([Booking, Ticket, TicketCategory])],
	controllers: [BookingController],
	providers: [BookingService],
	exports: [BookingService],
})
export class BookingModule {}


