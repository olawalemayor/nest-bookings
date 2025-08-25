import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { BookingsModule } from '../src/modules/bookings/bookings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../src/modules/bookings/booking.entity';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from '../src/security/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from '../src/security/jwt.strategy';

describe('E2E Happy Path', () => {
  let app: INestApplication;
  const jwtSecret = 'test_secret';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: jwtSecret }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Booking],
          synchronize: true,
        }),
        BullModule.forRoot({ connection: { host: 'localhost', port: 6379 } }),
        BookingsModule
      ],
      providers: [
        JwtStrategy,
        { provide: APP_GUARD, useClass: RolesGuard },
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /bookings -> 201 and returns booking', async () => {
    // Create a test JWT with provider role
    const jwt = require('jsonwebtoken').sign({ sub: 'u1', roles: ['provider'] }, jwtSecret, { expiresIn: '1h' });

    const startsAt = new Date(Date.now() + 40 * 60 * 1000).toISOString();
    const res = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        clientName: 'John Doe',
        clientPhone: '+15555550123',
        service: 'HAIRCUT',
        startsAt,
        notes: 'n/a'
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.service).toBe('HAIRCUT');
  });
});
