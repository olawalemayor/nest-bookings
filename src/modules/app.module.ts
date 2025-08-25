import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '../observability/health.controller';
import { BookingsModule } from '../modules/bookings/bookings.module';
import { AuthModule } from '../security/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { Booking } from '../modules/bookings/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'nest',
        password: process.env.DB_PASS || 'nest',
        database: process.env.DB_NAME || 'bookings',
        entities: [Booking],
        synchronize: false
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    TerminusModule,
    AuthModule,
    BookingsModule
  ],
  controllers: [HealthController],
})
export class AppModule {}
