import { Module } from '@nestjs/common';
import { QueueGateway } from './queue.gateway';
import { QueueService } from './queue.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [QueueGateway, QueueService]
})
export class QueueModule {}
