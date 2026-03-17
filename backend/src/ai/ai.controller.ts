import { Controller, Get, Param } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('recommendations/:patientId')
  async getRecommendations(@Param('patientId') patientId: string) {
    return this.aiService.generateRecommendations(patientId);
  }
}
