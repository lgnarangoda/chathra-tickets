import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerDto } from './model/dto/organizer.dto';

@Controller({ path: 'organizers', version: '1' })
export class OrganizerController {
	constructor(private readonly organizerService: OrganizerService) {}

	@Post()
	async create(@Body() dto: OrganizerDto) {
		return this.organizerService.create(dto);
	}		

	@Get('/by-event/:eventId')
	async getByEvent(@Param('eventId') eventId: string) {
		return this.organizerService.getByEventId(Number(eventId));
	}
}


