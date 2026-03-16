import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }
})
export class QueueGateway {
  @WebSocketServer()
  server: Server;

  // Allows clients (dashboard/app) to join a specific doctor's waiting room
  @SubscribeMessage('joinQueue')
  handleJoinQueue(@MessageBody() doctorId: string, @ConnectedSocket() client: Socket) {
    client.join(doctorId);
    return { event: 'joined', data: doctorId };
  }

  // Central method called by QueueService to push updates
  broadcastQueueUpdate(doctorId: string, remainingTokens: any[]) {
    this.server.to(doctorId).emit('queue_updated', {
      doctorId,
      timestamp: new Date(),
      queue: remainingTokens
    });
  }
}
