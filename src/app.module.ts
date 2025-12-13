import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './config/configs.module';
import { UserModule } from './user/user.module';
import { VenueModule } from './venue/venue.module';
import { EventModule } from './event/event.module';
import { OrganizerModule } from './organizer/organizer.module';
import { TicketCategoryModule } from './ticket-category/ticket-category.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigsModule,
    VenueModule,
    EventModule,
    OrganizerModule,
    TicketCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
