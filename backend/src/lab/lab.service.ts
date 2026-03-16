import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabService {
  constructor(private prisma: PrismaService) {}

  async createLabOrder(emrRecordId: string, testName: string, urgency: string) {
    return this.prisma.labOrder.create({
      data: {
        emrRecordId,
        testName,
        urgency,
        status: 'PENDING'
      }
    });
  }

  async getPendingOrders() {
    return this.prisma.labOrder.findMany({
      where: { status: 'PENDING' },
      include: {
        emrRecord: {
          include: { patient: true }
        }
      }
    });
  }

  async uploadResult(orderId: string, resultUrl: string, criticalFlag: boolean) {
    const updatedOrder = await this.prisma.labOrder.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        resultUrl,
        criticalFlag
      },
      include: {
        emrRecord: { include: { doctor: true } }
      }
    });

    if (criticalFlag) {
      // In a real scenario, trigger high-priority push notification / SMS
      // to the doctor (updatedOrder.emrRecord.doctor)
      console.warn(`[URGENT] Critical Lab Result for Order ${orderId}`);
    }

    return updatedOrder;
  }
}
