import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';

describe('BookingsService', () => {
  let service: BookingsService;
  let repo: Repository<Booking>;
  let queue: Queue;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: { create: jest.fn(), save: jest.fn() } },
        { provide: 'BullQueue_bookingQueue', useValue: { add: jest.fn() } }
      ],
    }).compile();

    service = module.get(BookingsService);
    repo = module.get(getRepositoryToken(Booking));
    queue = module.get('BullQueue_bookingQueue');
  });

  it('creates a booking and enqueues jobs', async () => {
    const startsAt = new Date(Date.now() + 30 * 60 * 1000);
    (repo.create as any).mockReturnValue({ startsAt });
    (repo.save as any).mockResolvedValue({ id: '1', startsAt });

    const res = await service.create({
      clientName: 'Jane Doe',
      clientPhone: '+15555550123',
      service: 'HAIRCUT',
      startsAt,
      notes: 'note',
    } as any);

    expect(res.id).toBe('1');
    expect((queue.add as any).mock.calls.some((c: any[]) => c[0] === 'created')).toBe(true);
    expect((queue.add as any).mock.calls.some((c: any[]) => c[0] === 'reminder')).toBe(true);
  });
});
