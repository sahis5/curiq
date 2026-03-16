import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  create(@Body() createDto: { emrRecordId: string; medicines: any[] }) {
    return this.prescriptionService.createPrescription(createDto.emrRecordId, createDto.medicines);
  }

  @Get('pending')
  getPending() {
    return this.prescriptionService.getPendingPrescriptions();
  }

  @Patch(':id/dispense')
  dispense(@Param('id') id: string) {
    return this.prescriptionService.dispensePrescription(id);
  }
}
