import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PrescriptionService],
  controllers: [PrescriptionController],
  exports: [PrescriptionService]
})
export class PrescriptionModule {}
