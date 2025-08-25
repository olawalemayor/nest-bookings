import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/ws', cors: { origin: '*' } })
export class BookingsGateway {
  @WebSocketServer()
  server: Server;

  emitCreated(payload: any) {
    this.server.emit('booking.created', payload);
  }

  emitReminder(payload: any) {
    this.server.emit('booking.reminder', payload);
  }
}
