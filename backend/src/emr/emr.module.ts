import { Module } from '@nestjs/common';
import { EmrService } from './emr.service';
import { EmrController } from './emr.controller';

@Module({
  providers: [EmrService],
  controllers: [EmrController]
})
export class EmrModule {}
