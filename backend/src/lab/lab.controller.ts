import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { LabService } from './lab.service';

@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Post()
  create(@Body() createDto: { emrRecordId: string; testName: string; urgency: string }) {
    return this.labService.createLabOrder(createDto.emrRecordId, createDto.testName, createDto.urgency);
  }

  @Get('pending')
  getPending() {
    return this.labService.getPendingOrders();
  }

  @Patch(':id/upload')
  uploadResult(@Param('id') id: string, @Body() uploadDto: { resultUrl: string; criticalFlag: boolean }) {
    return this.labService.uploadResult(id, uploadDto.resultUrl, uploadDto.criticalFlag);
  }
}
