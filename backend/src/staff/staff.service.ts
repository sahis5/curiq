import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async getAllStaff() {
    const defaultStaff = await this.prisma.staff.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    
    const doctors = await this.prisma.doctor.findMany({
      select: { id: true, name: true, email: true, specialization: true }
    });

    return {
      staff: defaultStaff,
      doctors: doctors.map(d => ({ ...d, role: 'DOCTOR' }))
    };
  }

  async createStaff(data: any) {
    if (data.role === 'DOCTOR') {
      const existing = await this.prisma.doctor.findFirst({ where: { email: data.email } });
      if (existing) throw new ConflictException('Email already in use');
      
      return this.prisma.doctor.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          specialization: data.specialization || 'General',
          departmentId: data.departmentId || 'dept-1',
          experienceYears: 0,
          consultationFee: 50.0
        }
      });
    } else {
      const existing = await this.prisma.staff.findUnique({ where: { email: data.email } });
      if (existing) throw new ConflictException('Email already in use');

      return this.prisma.staff.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role
        }
      });
    }
  }

  async updateStaff(id: string, data: any) {
    if (data.role === 'DOCTOR') {
      return this.prisma.doctor.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          password: data.password ? data.password : undefined,
          specialization: data.specialization
        }
      });
    } else {
      return this.prisma.staff.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          password: data.password ? data.password : undefined,
          role: data.role
        }
      });
    }
  }
}
