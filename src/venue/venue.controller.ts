import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VenueDto } from './model/dto/venue.dto';
import { VenueService } from './venue.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller({ path: 'venues', version: '1' })
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  async create(@Body() venueDto: VenueDto) {
    return this.venueService.create(venueDto);
  }

  @Get()
  async list(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 20, sort } = pagination;
    return this.venueService.paginate(page, limit, sort);
  }
}

