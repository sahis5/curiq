import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async generateInvoice(appointmentId: string) {
    // 1. Fetch appointment details
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true,
      }
    });

    if (!appointment) throw new Error("Appointment not found");

    // 2. Fetch associated EMR to find Lab Orders & Prescriptions
    const emr = await this.prisma.emrRecord.findFirst({
      where: { patientId: appointment.patientId, doctorId: appointment.doctorId },
      orderBy: { visitDate: 'desc' },
      include: { labOrders: true, prescriptions: true }
    });

    // 3. Calculate breakdown (Mock Pricing)
    let totalAmount = 500.0; // Base Consultation Fee
    const items = [{ description: "Consultation Fee", amount: 500.0 }];

    if (emr) {
      if (emr.labOrders.length > 0) {
        const labCost = emr.labOrders.length * 200;
        totalAmount += labCost;
        items.push({ description: `Lab Tests (${emr.labOrders.length})`, amount: labCost });
      }
      if (emr.prescriptions.length > 0) {
        // Assume pharmacy isn't billed directly here, but could have a separate handling fee
        items.push({ description: "E-Prescription Processing", amount: 50.0 });
        totalAmount += 50.0;
      }
    }

    // 4. Create Invoice
    return this.prisma.billingInvoice.create({
      data: {
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        itemsJson: items,
        totalAmount,
        paymentStatus: 'PENDING',
        // In real system, insurance eligibility check happens here
        insuranceClaimId: null 
      }
    });
  }

  async processPreAuth(appointmentId: string, insuranceDetails: any) {
    // Mock pre-authorization logic
    return {
      status: 'APPROVED',
      coveragePercent: 80,
      estimatedPatientResponsibility: 20
    };
  }
}
