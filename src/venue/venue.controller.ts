import { Body, Controller, Post } from '@nestjs/common';
import { VenueDto } from './model/dto/venue.dto';
import { VenueService } from './venue.service';

@Controller({ path: 'venues', version: '1' })
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  async create(@Body() venueDto: VenueDto) {
    return this.venueService.create(venueDto);
  }
}

