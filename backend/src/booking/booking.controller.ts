import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('doctors/search')
  searchDoctors(
    @Query('q') query?: string,
    @Query('minRating') minRating?: number,
    @Query('maxFee') maxFee?: number,
    @Query('mode') mode?: string
  ) {
    return this.bookingService.searchDoctors(query, minRating, maxFee, mode);
  }

  @Get('doctors/:id')
  getDoctorProfile(@Param('id') id: string) {
    return this.bookingService.getDoctorProfile(id);
  }

  @Post('hold')
  holdSlot(@Body() dto: { patientId: string; doctorId: string; date: string; time: string; mode: string }) {
    return this.bookingService.holdSlot(dto.patientId, dto.doctorId, dto.date, dto.time, dto.mode);
  }

  @Post('confirm')
  confirmBooking(@Body() dto: { appointmentId: string; paymentMethod: string }) {
    return this.bookingService.confirmBooking(dto.appointmentId, dto.paymentMethod);
  }

  @Post('waitlist')
  joinWaitlist(@Body() dto: { patientId: string; doctorId: string; requestedDate: string; reason: string }) {
    return this.bookingService.joinWaitlist(dto.patientId, dto.doctorId, dto.requestedDate, dto.reason);
  }
}
