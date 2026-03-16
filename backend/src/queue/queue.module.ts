import { Module } from '@nestjs/common';
import { QueueGateway } from './queue.gateway';
import { QueueService } from './queue.service';

@Module({
  providers: [QueueGateway, QueueService]
})
export class QueueModule {}
