import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Processor('reminders')
export class AppointmentProcessor extends WorkerHost {
  private readonly logger = new Logger(AppointmentProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'sendReminder':
        const { appointmentId, type } = job.data;
        const appointment = await this.prisma.appointment.findUnique({
          where: { id: appointmentId },
          include: { patient: true }
        });

        if (!appointment) return;

        // In reality, this would trigger FCM, Twilio SMS, or Email provider
        // Module 9 integration point
        this.logger.log(`Dispatching [${type}] reminder to Patient ${appointment.patient.name} (${appointment.patient.phone}) for appointment on ${appointment.slotTime}`);
        
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
}
