import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Booking } from '../modules/bookings/booking.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'nest',
  password: process.env.DB_PASS || 'nest',
  database: process.env.DB_NAME || 'bookings',
  entities: [Booking],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false
});

export default AppDataSource;
