import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubEvent } from './model/sub-event.entity';
import { SubEventController } from './sub-event.controller';
import { SubEventService } from './sub-event.service';

@Module({
	imports: [TypeOrmModule.forFeature([SubEvent])],
	controllers: [SubEventController],
	providers: [SubEventService],
	exports: [SubEventService],
})
export class SubEventModule {}


