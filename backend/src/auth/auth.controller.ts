import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('patient/login')
  patientLogin(@Body() body: Record<string, any>) {
    return this.authService.patientLogin(body.email, body.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('patient/signup')
  patientSignup(@Body() body: Record<string, any>) {
    return this.authService.patientSignup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('staff/login')
  staffLogin(@Body() body: Record<string, any>) {
    return this.authService.staffLogin(body.email, body.password, body.type || 'STAFF');
  }
}

