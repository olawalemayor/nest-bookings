import { Controller, Post, Get, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { Roles } from '../../security/roles.decorator';
import { RolesGuard } from '../../security/roles.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  @Roles('provider', 'admin')
  create(@Body() dto: CreateBookingDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  @Roles('provider', 'admin')
  getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get()
  @Roles('provider', 'admin')
  list(
    @Query('range') range: 'upcoming' | 'past' = 'upcoming',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.service.list(range, parseInt(page, 10), parseInt(limit, 10));
  }
}
