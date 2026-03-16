import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppointmentModule } from './appointment/appointment.module';
import { EmrModule } from './emr/emr.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { LabModule } from './lab/lab.module';

@Module({
  imports: [AuthModule, QueueModule, PrismaModule, AppointmentModule, EmrModule, PrescriptionModule, LabModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
