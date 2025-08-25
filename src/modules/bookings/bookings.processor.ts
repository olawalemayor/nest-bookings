import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { BookingsGateway } from './bookings.gateway';

@Injectable()
@Processor('bookingQueue')
export class BookingsProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Booking) private repo: Repository<Booking>,
    private gateway: BookingsGateway,
  ) { super(); }

  async process(job: Job): Promise<any> {
    if (job.name === 'created') {
      const booking = await this.repo.findOne({ where: { id: job.data.id } });
      if (booking) this.gateway.emitCreated(booking);
      return true;
    }
    if (job.name === 'reminder') {
      const booking = await this.repo.findOne({ where: { id: job.data.id } });
      if (booking) this.gateway.emitReminder({ id: booking.id, startsAt: booking.startsAt });
      return true;
    }
    return true;
  }
}
