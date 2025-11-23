import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refund } from './model/refund.entity';
import { Payment } from '../payment/model/payment.entity';
import { RefundController } from './refund.controller';
import { RefundService } from './refund.service';

@Module({
	imports: [TypeOrmModule.forFeature([Refund, Payment])],
	controllers: [RefundController],
	providers: [RefundService],
	exports: [RefundService],
})
export class RefundModule {}


