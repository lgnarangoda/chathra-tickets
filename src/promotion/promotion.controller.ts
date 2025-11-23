import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionDto } from './model/dto/promotion.dto';

@Controller({ path: 'promotions', version: '1' })
export class PromotionController {
	constructor(private readonly promotionService: PromotionService) {}

	@Post()
	async create(@Body() dto: PromotionDto) {
		return this.promotionService.create(dto);
	}

	@Get('/by-event/:eventId')
	async listByEvent(@Param('eventId') eventId: string) {
		return this.promotionService.listByEventId(Number(eventId));
	}
}


