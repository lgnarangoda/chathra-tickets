import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SubEventService } from './sub-event.service';
import { SubEventDto } from './model/dto/sub-event.dto';
import { SubEventStatus } from '../model/enums/sub-event-status.enum';

@Controller({ path: 'sub-events', version: '1' })
export class SubEventController {
	constructor(private readonly subEventService: SubEventService) {}

	@Post()
	async create(@Body() dto: SubEventDto) {
		return this.subEventService.create(dto);
	}

	@Get(':subEventId')
	async getById(@Param('subEventId') subEventId: string) {
		return this.subEventService.findById(Number(subEventId));
	}

	@Patch(':subEventId/status')
	async updateStatus(
		@Param('subEventId') subEventId: string,
		@Body() body: { status: SubEventStatus },
	) {
		return this.subEventService.updateStatus(Number(subEventId), body.status);
	}
}


