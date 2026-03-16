import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(userId: string, role: string) {
    // Basic mock logic: verifying user exists
    let user = null;
    if (role === 'DOCTOR') user = await this.prisma.doctor.findUnique({ where: { id: userId } });
    else if (role === 'PATIENT') user = await this.prisma.patient.findUnique({ where: { id: userId } });
    else if (role === 'RECEPTION' || role === 'ADMIN') user = { id: userId, name: role };

    if (!user) throw new UnauthorizedException('User not found');

    const payload = { sub: userId, role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Helper guard integration logic can be placed here...
}
