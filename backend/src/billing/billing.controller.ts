import { Controller, Post, Param } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post(':appointmentId/invoice')
  generateInvoice(@Param('appointmentId') appointmentId: string) {
    return this.billingService.generateInvoice(appointmentId);
  }

  @Post(':appointmentId/pre-auth')
  processPreAuth(@Param('appointmentId') appointmentId: string) {
    // Mock insurance details
    return this.billingService.processPreAuth(appointmentId, { provider: 'MediCare', plan: 'Gold' });
  }
}
