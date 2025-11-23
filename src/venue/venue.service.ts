import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './model/venue.entity';
import { VenueStatus } from '../model/enums/venue-status.enum';
import { VenueDto } from './model/dto/venue.dto';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  async create(venueDto: VenueDto): Promise<Venue> {
    const { venueId, eventVenues, status, isParkingAvailable, ...venueData } =
      venueDto;

    const payload = {
      ...venueData,
      isParkingAvailable: isParkingAvailable ?? false,
      status: status ?? VenueStatus.ACTIVE,
    };

    const venue = this.venueRepository.create(payload);

    return this.venueRepository.save(venue);
  }

  async paginate(page: number, limit: number, sort?: string) {
    const skip = (page - 1) * limit;
    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      const [field, direction] = sort.split(':');
      order[field] = direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    } else {
      order['venueId'] = 'DESC';
    }
    const [items, total] = await this.venueRepository.findAndCount({
      take: limit,
      skip,
      order,
    });
    return {
      items,
      page,
      limit,
      total,
      nextPage: page * limit < total ? page + 1 : null,
    };
  }
}

