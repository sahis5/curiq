import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  getAllStaff() {
    return this.staffService.getAllStaff();
  }

  @Post()
  createStaff(@Body() data: any) {
    return this.staffService.createStaff(data);
  }

  @Put(':id')
  updateStaff(@Param('id') id: string, @Body() data: any) {
    return this.staffService.updateStaff(id, data);
  }
}
