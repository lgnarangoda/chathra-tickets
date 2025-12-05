import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TicketCategoryStatus } from '../../../model/enums/ticket-category-status.enum';
import type { EventDto } from '../../../event/model/dto/event.dto';
import type { TicketDto } from '../../../model/dto/ticket.dto';
import type { TicketSubEventDto } from './ticket-sub-event.dto';

export class TicketCategoryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ticketCategoryId?: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  eventId: number;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxQuantity?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minQuantity?: number | null;

  @IsOptional()
  @IsEnum(TicketCategoryStatus)
  status?: TicketCategoryStatus;

  @IsOptional()
  @IsString()
  seatMap?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  event?: EventDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  ticketSubEvents?: TicketSubEventDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  tickets?: TicketDto[];
}


