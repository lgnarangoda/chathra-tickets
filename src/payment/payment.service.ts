import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './model/payment.entity';
import { PaymentDto } from './model/dto/payment.dto';
import { Booking } from '../booking/model/booking.entity';

@Injectable()
export class PaymentService {
	constructor(
		@InjectRepository(Payment)
		private readonly paymentRepository: Repository<Payment>,
		@InjectRepository(Booking)
		private readonly bookingRepository: Repository<Booking>,
	) {}

	async create(dto: PaymentDto): Promise<Payment> {
		const { booking, refunds, ...data } = dto;
		const payload = { ...data };
		const payment = this.paymentRepository.create(payload as any);
		return this.paymentRepository.save(payment as any);
	}

	async listByEventId(eventId: number) {
		return this.paymentRepository
			.createQueryBuilder('payment')
			.innerJoin('payment.booking', 'booking')
			.where('booking.eventId = :eventId', { eventId })
			.getMany();
	}
}


