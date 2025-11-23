import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './model/payment.entity';
import { Booking } from '../booking/model/booking.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
	imports: [TypeOrmModule.forFeature([Payment, Booking])],
	controllers: [PaymentController],
	providers: [PaymentService],
	exports: [PaymentService],
})
export class PaymentModule {}


