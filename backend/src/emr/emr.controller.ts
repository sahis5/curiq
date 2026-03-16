import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { EmrService } from './emr.service';
import { BillingService } from '../billing/billing.service';

@Controller('emr')
export class EmrController {
  constructor(
    private readonly emrService: EmrService,
    private readonly billingService: BillingService
  ) {}

  @Post()
  async create(@Body() createDto: { 
    patientId: string; 
    doctorId: string; 
    appointmentId: string;
    soapNotes: any; 
    vitalsJson: any; 
    icd10Codes: string[] 
  }) {
    // 1. Create EMR Record
    const emrRecord = await this.emrService.createEmrRecord(
      createDto.patientId, 
      createDto.doctorId, 
      createDto.soapNotes, 
      createDto.vitalsJson, 
      createDto.icd10Codes
    );
    
    // 2. Automatically generate the billing invoice for this visit
    if (createDto.appointmentId) {
      // Background operation to not block the response
      this.billingService.generateInvoice(createDto.appointmentId).catch(err => {
         console.error('[Billing Engine] Error creating invoice:', err);
      });
    }

    return emrRecord;
  }
}
