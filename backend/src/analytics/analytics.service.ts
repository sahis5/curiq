import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardKPIs() {
    // 1. Total Patient Footfall (Appointments today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const footfall = await this.prisma.appointment.count({
      where: {
        slotTime: { gte: today }
      }
    });

    // 2. Total Revenue (Sum of all completed invoices today)
    // Using simple findMany since we don't have createdAt on BillingInvoice in our mock schema,
    // assuming we fetch recent records.
    const invoices = await this.prisma.billingInvoice.findMany({
      take: 100 // Mocking recent records
    });
    const revenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    // 3. Active Doctors
    const activeDoctors = await this.prisma.doctor.count({
      where: { isAvailable: true }
    });

    // 4. Average Wait Time (Mock aggregation of queue tokens)
    const tokens = await this.prisma.queueToken.findMany({
      where: {
        status: 'COMPLETED',
        calledAt: { not: null }
      }
    });

    let avgWaitTimeMins = 0;
    if (tokens.length > 0) {
      const totalWaitMs = tokens.reduce((sum, t) => {
        // Fallback to calledAt - startTime (using startTime as proxy for token generation time)
        return sum + (t.calledAt!.getTime() - t.startTime.getTime());
      }, 0);
      avgWaitTimeMins = Math.round(totalWaitMs / tokens.length / 60000);
    }

    return {
      footfall,
      revenue,
      activeDoctors,
      avgWaitTimeMins
    };
  }

  async getRevenueByDepartment() {
    // Mock data for the chart
    return [
      { name: 'Cardiology', revenue: 4500 },
      { name: 'Neurology', revenue: 3200 },
      { name: 'Pediatrics', revenue: 2800 },
      { name: 'General', revenue: 5100 },
    ];
  }
}
