import { Controller, Get, Query, Patch, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private prisma: PrismaService) {}

  @Patch(':id/complete')
  async completeAppointment(@Param('id') id: string) {
    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
    // Also mark the queue token as completed
    if (appointment) {
      await this.prisma.queueToken.updateMany({
        where: { appointmentId: id },
        data: { status: 'COMPLETED' },
      });
    }
    return appointment;
  }

  @Get('today')
  async getTodayAppointments(@Query('doctorId') doctorId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const where: any = {
      slotTime: { gte: today, lt: tomorrow },
      status: { in: ['CONFIRMED', 'PENDING'] },
    };
    if (doctorId) where.doctorId = doctorId;

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
        queueToken: true,
      },
      orderBy: { slotTime: 'asc' },
    });
  }
}

