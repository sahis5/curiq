import { Module } from '@nestjs/common';
import { EmrService } from './emr.service';
import { EmrController } from './emr.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [PrismaModule, BillingModule],
  providers: [EmrService],
  controllers: [EmrController],
  exports: [EmrService]
})
export class EmrModule {}
