import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './model/promotion.entity';
import { PromotionDto } from './model/dto/promotion.dto';

@Injectable()
export class PromotionService {
	constructor(
		@InjectRepository(Promotion)
		private readonly promotionRepository: Repository<Promotion>,
	) {}

	async create(dto: PromotionDto): Promise<Promotion> {
		const { event, ...data } = dto;
		const payload : any = { ...data };
		const entity = this.promotionRepository.create(payload);
		return this.promotionRepository.save(entity as any);
	}

	async listByEventId(eventId: number) {
		return this.promotionRepository.find({ where: { eventId } });
	}
}


