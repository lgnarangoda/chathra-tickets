import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './model/organizer.entity';
import { Event } from '../event/model/eventData.entity';
import { OrganizerController } from './organizer.controller';
import { OrganizerService } from './organizer.service';

@Module({
	imports: [TypeOrmModule.forFeature([Organizer, Event])],
	controllers: [OrganizerController],
	providers: [OrganizerService],
	exports: [OrganizerService],
})
export class OrganizerModule {}


