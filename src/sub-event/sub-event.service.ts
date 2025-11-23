import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubEvent } from './model/sub-event.entity';
import { SubEventStatus } from '../model/enums/sub-event-status.enum';
import { SubEventDto } from './model/dto/sub-event.dto';

@Injectable()
export class SubEventService {
	constructor(
		@InjectRepository(SubEvent)
		private readonly subEventRepository: Repository<SubEvent>,
	) {}

	async create(dto: SubEventDto): Promise<SubEvent> {
		const {
			subEventId,
			version,
			isDraft,
			approvalStatus,
			status,
			event,
			resourcePersons,
			ticketSubEvents,
			...data
		} = dto;
		const payload = {
			...data,
			isDraft: dto.isDraft ?? false,
			version: dto.version ?? 1,
			status: status ?? SubEventStatus.ACTIVE,
		};
		const subEvent = this.subEventRepository.create(payload);
		return this.subEventRepository.save(subEvent);
	}

	async findById(subEventId: number): Promise<SubEvent | null> {
		return this.subEventRepository.findOne({ where: { subEventId } });
	}

	async updateStatus(subEventId: number, status: SubEventStatus) {
		const subEvent = await this.subEventRepository.findOneOrFail({
			where: { subEventId },
		});
		subEvent.status = status;
		return this.subEventRepository.save(subEvent);
	}

	async listByEvent(eventId: number) {
		return this.subEventRepository.find({ where: { eventId } });
	}
}


