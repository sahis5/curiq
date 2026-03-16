import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('reminders') private remindersQueue: Queue
  ) {}

  async bookAppointment(patientId: string, doctorId: string, slotTime: Date, channel: string) {
    // 1. Calculate token number for the day
    const dayStart = new Date(slotTime);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(slotTime);
    dayEnd.setHours(23, 59, 59, 999);

    const existingCount = await this.prisma.appointment.count({
      where: {
        doctorId,
        slotTime: { gte: dayStart, lte: dayEnd }
      }
    });

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        slotTime,
        tokenNumber: existingCount + 1,
        status: 'SCHEDULED',
        bookingChannel: channel
      }
    });

    // 2. Schedule Reminders
    const msUntilAppointment = slotTime.getTime() - new Date().getTime();
    
    // 24 Hour Reminder
    if (msUntilAppointment > 24 * 60 * 60 * 1000) {
      await this.remindersQueue.add('sendReminder', { appointmentId: appointment.id, type: '24HR' }, { delay: msUntilAppointment - (24 * 60 * 60 * 1000) });
    }

    // 2 Hour Reminder
    if (msUntilAppointment > 2 * 60 * 60 * 1000) {
      await this.remindersQueue.add('sendReminder', { appointmentId: appointment.id, type: '2HR' }, { delay: msUntilAppointment - (2 * 60 * 60 * 1000) });
    }

    return appointment;
  }
}
