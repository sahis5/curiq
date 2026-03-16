import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpis')
  getKpis() {
    return this.analyticsService.getDashboardKPIs();
  }

  @Get('revenue/department')
  getRevenueChart() {
    return this.analyticsService.getRevenueByDepartment();
  }
}
