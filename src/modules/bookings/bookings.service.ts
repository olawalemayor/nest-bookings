import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { bookingsCreatedCounter } from '../../metrics/metrics.middleware';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private repo: Repository<Booking>,
    @InjectQueue('bookingQueue') private queue: Queue,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const b = this.repo.create({
      clientName: dto.clientName,
      clientPhone: dto.clientPhone,
      service: dto.service,
      startsAt: dto.startsAt,
      notes: dto.notes || null
    });
    const saved = await this.repo.save(b);

    // Broadcast via queue (decouple from API thread) and schedule reminder
    await this.queue.add('created', { id: saved.id }, { removeOnComplete: true, removeOnFail: true });

    const reminderAt = new Date(saved.startsAt.getTime() - 10 * 60 * 1000);
    const delay = reminderAt.getTime() - Date.now();
    if (delay > 0) {
      await this.queue.add('reminder', { id: saved.id }, { delay, removeOnComplete: true, removeOnFail: true });
    }

    bookingsCreatedCounter.inc();
    return saved;
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async list(range: 'upcoming' | 'past', page = 1, limit = 10) {
    const now = new Date();
    const where = range === 'past' ? { startsAt: LessThan(now) } : { startsAt: MoreThan(now) };
    const [items, total] = await this.repo.findAndCount({
      where,
      order: { startsAt: range === 'past' ? 'DESC' : 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }
}
