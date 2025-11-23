import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketCategory } from './model/ticket-category.entity';
import { Ticket } from '../model/ticket.entity';
import { TicketSubEvent } from './model/ticket-sub-event.entity';
import { TicketCategoryController } from './ticket-category.controller';
import { TicketCategoryService } from './ticket-category.service';

@Module({
	imports: [TypeOrmModule.forFeature([TicketCategory, Ticket, TicketSubEvent])],
	controllers: [TicketCategoryController],
	providers: [TicketCategoryService],
	exports: [TicketCategoryService],
})
export class TicketCategoryModule {}


