import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueGateway } from './queue.gateway';

@Injectable()
export class QueueService {
  constructor(
    private prisma: PrismaService,
    private queueGateway: QueueGateway
  ) {}

  async calculateDoctorAvgTime(doctorId: string): Promise<number> {
    const last10Tokens = await this.prisma.queueToken.findMany({
      where: {
        doctorId,
        status: 'COMPLETED',
        durationSec: { not: null }
      },
      orderBy: { endTime: 'desc' },
      take: 10
    });

    if (last10Tokens.length === 0) {
      return 600; // Default 10 mins (600 seconds)
    }

    const totalDuration = last10Tokens.reduce((acc, t) => acc + (t.durationSec || 0), 0);
    const avgTime = Math.floor(totalDuration / last10Tokens.length);
    
    // Update doctor's record with new avg
    await this.prisma.doctor.update({
      where: { id: doctorId },
      data: { avgConsultationTime: avgTime }
    });

    return avgTime;
  }

  async advanceQueue(doctorId: string, completedTokenId: string) {
    const now = new Date();

    // 1. Mark current as complete
    const currentToken = await this.prisma.queueToken.findUnique({ where: { id: completedTokenId } });
    if (!currentToken) return;

    const durationSec = currentToken.startTime 
      ? Math.floor((now.getTime() - currentToken.startTime.getTime()) / 1000)
      : null;

    await this.prisma.queueToken.update({
      where: { id: completedTokenId },
      data: {
        status: 'COMPLETED',
        endTime: now,
        durationSec
      }
    });

    // 2. Recalculate average time
    const avgTime = await this.calculateDoctorAvgTime(doctorId);

    // 3. Find next patient
    const nextTokens = await this.prisma.queueToken.findMany({
      where: { doctorId, status: 'WAITING' },
      orderBy: { queuePosition: 'asc' }
    });

    if (nextTokens.length > 0) {
      const nextToken = nextTokens[0];
      await this.prisma.queueToken.update({
        where: { id: nextToken.id },
        data: {
          status: 'CALLED',
          calledAt: now
        }
      });
    }

    // 4. Broadcast update via WebSockets
    this.broadcastQueueUpdate(doctorId, avgTime, nextTokens);
  }

  private broadcastQueueUpdate(doctorId: string, avgTime: number, remainingTokens: any[]) {
    const queueData = remainingTokens.map((t, i) => ({
      tokenId: t.id,
      position: t.queuePosition,
      etaSec: i * avgTime
    }));

    this.queueGateway.broadcastQueueUpdate(doctorId, queueData);
  }
}
