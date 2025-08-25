import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsGateway } from './bookings.gateway';
import { BookingsProcessor } from './bookings.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    BullModule.registerQueue({ name: 'bookingQueue' }),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsGateway, BookingsProcessor],
  exports: [BookingsService],
})
export class BookingsModule {}
