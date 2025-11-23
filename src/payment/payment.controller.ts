import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './model/dto/payment.dto';

@Controller({ path: 'payments', version: '1' })
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post()
	async create(@Body() dto: PaymentDto) {
		return this.paymentService.create(dto);
	}

	@Get('/by-event/:eventId')
	async listByEvent(@Param('eventId') eventId: string) {
		return this.paymentService.listByEventId(Number(eventId));
	}
}


