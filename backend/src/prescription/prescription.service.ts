import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrescriptionService {
  constructor(private prisma: PrismaService) {}

  // Mock drug interaction checker
  private checkDrugInteractions(medicinesReq: any[]): { passed: boolean; warnings: string[] } {
    const medicineNames = medicinesReq.map(m => m.name.toLowerCase());
    const warnings: string[] = [];

    // Simple mock rules
    if (medicineNames.includes('warfarin') && medicineNames.includes('aspirin')) {
      warnings.push('Severe interaction: Warfarin + Aspirin increases bleeding risk.');
    }
    if (medicineNames.includes('sildenafil') && medicineNames.includes('nitroglycerin')) {
      warnings.push('Severe interaction: Sildenafil + Nitrates can cause severe hypotension.');
    }

    return {
      passed: warnings.length === 0,
      warnings
    };
  }

  async createPrescription(emrRecordId: string, medicines: any[]) {
    const interactionCheck = this.checkDrugInteractions(medicines);
    
    if (!interactionCheck.passed) {
      throw new BadRequestException({
        message: 'Drug interaction check failed',
        warnings: interactionCheck.warnings
      });
    }

    const prescription = await this.prisma.prescription.create({
      data: {
        emrRecordId,
        medicinesJson: medicines,
        drugCheckPassed: true,
        dispatchedToPharmacy: false
      }
    });

    // In a real scenario, we might emit a WebSocket event to the pharmacy here,
    // or rely on the pharmacy dashboard polling/fetching unfulfilled prescriptions.

    return prescription;
  }

  async getPendingPrescriptions() {
    return this.prisma.prescription.findMany({
      where: { dispatchedToPharmacy: false },
      orderBy: { createdAt: 'asc' },
      include: {
        emrRecord: {
          include: {
            patient: true,
            doctor: true
          }
        }
      }
    });
  }

  async dispensePrescription(prescriptionId: string) {
    return this.prisma.prescription.update({
      where: { id: prescriptionId },
      data: { dispatchedToPharmacy: true }
    });
  }
}
