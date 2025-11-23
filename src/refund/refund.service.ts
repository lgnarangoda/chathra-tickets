import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refund } from './model/refund.entity';
import { RefundDto } from './model/dto/refund.dto';

@Injectable()
export class RefundService {
	constructor(
		@InjectRepository(Refund)
		private readonly refundRepository: Repository<Refund>,
	) {}

	async create(dto: RefundDto): Promise<Refund> {
		const { payment, refundedBy, ...data } = dto;
		const payload = { ...data };
		const entity = this.refundRepository.create(payload);
		return this.refundRepository.save(entity);
	}

	async listByEventId(eventId: number) {
		return this.refundRepository
			.createQueryBuilder('refund')
			.innerJoin('refund.payment', 'payment')
			.innerJoin('payment.booking', 'booking')
			.where('booking.eventId = :eventId', { eventId })
			.getMany();
	}
}


