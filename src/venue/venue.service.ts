import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
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

    const payload: DeepPartial<Venue> = {
      ...venueData,
      isParkingAvailable: isParkingAvailable ?? false,
      status: status ?? VenueStatus.ACTIVE,
    };

    const venue = this.venueRepository.create(payload);

    return this.venueRepository.save(venue);
  }
}

