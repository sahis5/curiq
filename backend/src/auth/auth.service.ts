import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async patientLogin(email: string, pass: string) {
    const user = await this.prisma.patient.findFirst({ where: { email } });
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, role: 'PATIENT', name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email }
    };
  }

  async patientSignup(data: any) {
    const existing = await this.prisma.patient.findFirst({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already in use');

    const user = await this.prisma.patient.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || '',
        dob: new Date(data.dob || '1990-01-01'),
        gender: data.gender || 'Unknown',
        bloodGroup: data.bloodGroup,
      }
    });

    const payload = { sub: user.id, role: 'PATIENT', name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email }
    };
  }

  async staffLogin(email: string, pass: string, type: 'DOCTOR' | 'STAFF') {
    let user;
    let role = '';
    
    if (type === 'DOCTOR') {
      user = await this.prisma.doctor.findFirst({ where: { email } });
      role = 'DOCTOR';
    } else {
      user = await this.prisma.staff.findFirst({ where: { email } });
      if (user) role = user.role;
    }

    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, role }
    };
  }
}

