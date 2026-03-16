import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  async sendToPatient(patientId: string, type: 'SMS' | 'PUSH' | 'EMAIL' | 'WHATSAPP', message: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) return null;

    // Simulate sending logic
    this.logger.log(`[Mock ${type}] Sending to ${patient.name} (${type === 'EMAIL' ? patient.email : patient.phone}): "${message}"`);

    // Log the notification to DB for history
    return this.prisma.notification.create({
      data: {
        patientId,
        type,
        message,
        channel: type,
        sentAt: new Date(),
      }
    });
  }

  async sendQueueAlert(patientId: string, position: number) {
    let message = '';
    if (position === 1) {
      message = "You are NEXT in line! Please proceed to the waiting area instantly.";
    } else if (position <= 5) {
      message = `You are position #${position} in the queue. Please get ready.`;
    } else {
      return; // Opt out of spamming too early
    }

    // Try Push first, fallback to SMS
    await this.sendToPatient(patientId, 'PUSH', message);
    await this.sendToPatient(patientId, 'SMS', message);
  }
}
