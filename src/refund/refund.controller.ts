import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RefundService } from './refund.service';
import { RefundDto } from './model/dto/refund.dto';

@Controller({ path: 'refunds', version: '1' })
export class RefundController {
	constructor(private readonly refundService: RefundService) {}

	@Post()
	async create(@Body() dto: RefundDto) {
		return this.refundService.create(dto);
	}

	@Get('/by-event/:eventId')
	async listByEvent(@Param('eventId') eventId: string) {
		return this.refundService.listByEventId(Number(eventId));
	}
}


