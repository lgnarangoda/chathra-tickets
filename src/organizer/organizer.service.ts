import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizer } from './model/organizer.entity';
import { OrganizerDto } from './model/dto/organizer.dto';
import { Event } from '../event/model/eventData.entity';

@Injectable()
export class OrganizerService {
	constructor(
		@InjectRepository(Organizer)
		private readonly organizerRepository: Repository<Organizer>,
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>,
	) {}

	async create(dto: OrganizerDto): Promise<Organizer> {
		const { profileImage, documents, events, ...data } = dto;
		const payload = { ...data };
		const organizer = this.organizerRepository.create(payload as any);
		const saved = await this.organizerRepository.save(organizer);
		return Array.isArray(saved) ? saved[0] : saved;
	}

	async getByEventId(eventId: number): Promise<Organizer | null> {
		const event = await this.eventRepository.findOne({ where: { eventId } });
		if (!event) return null;
		if (!('organizerId' in event) || !event.organizerId) return null;
		return this.organizerRepository.findOne({
			where: { organizerId: event.organizerId as any },
		});
	}
}


