import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmrService {
  constructor(private prisma: PrismaService) {}

  async createEmrRecord(patientId: string, doctorId: string, soapNotes: string, vitals: any, icd10Codes: string[]) {
    // Save record to Primary Postgres
    return this.prisma.emrRecord.create({
      data: {
        patientId,
        doctorId,
        soapNotes,
        icd10Code: Array.isArray(icd10Codes) ? icd10Codes.join(', ') : (icd10Codes || ''),
        vitalsJson: vitals
      }
    });

    // In a prod environment: Write the time-series vital data async to TimescaleDB
    // via a separate microservice or raw query to hypertable
  }

  async getPatientHistory(patientId: string) {
    return this.prisma.emrRecord.findMany({
      where: { patientId },
      orderBy: { visitDate: 'desc' },
      include: {
        doctor: { select: { name: true, specialization: true } },
        prescriptions: true,
        labOrders: true
      }
    });
  }
}
