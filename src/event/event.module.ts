import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './model/eventData.entity';
import { TicketCategory } from '../ticket-category/model/ticket-category.entity';
import { Ticket } from '../model/ticket.entity';
import { Payment } from '../payment/model/payment.entity';
import { Promotion } from '../promotion/model/promotion.entity';
import { Refund } from '../refund/model/refund.entity';
import { SubEvent } from '../sub-event/model/sub-event.entity';
import { EventVenue } from '../model/event-venue.entity';
import { File } from '../model/file.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Event,
			TicketCategory,
			Ticket,
			Payment,
			Promotion,
			Refund,
			SubEvent,
			EventVenue,
			File,
		]),
	],
	controllers: [EventController],
	providers: [EventService],
	exports: [EventService],
})
export class EventModule {}


