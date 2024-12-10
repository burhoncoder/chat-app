import { OnModuleInit, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

import { AuthService } from '../auth/app/services/auth.service';
import { AuthenticateAction, NOTIFICATION_ACTIONS } from './notification.types';

@Injectable()
@WebSocketGateway({ path: '/ws', cors: true, transport: 'ws' })
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer() server: Server;
  private activeUsers = new Map<number, WebSocket>();

  constructor(private authService: AuthService) {}

  onModuleInit() {
    this.server.on('connection', (socket: WebSocket) => {
      socket.on('message', (data) => {
        const response: AuthenticateAction = JSON.parse(data.toString() || '');
        if (
          response?.type === NOTIFICATION_ACTIONS.AUTHENTICATE &&
          response?.payload
        ) {
          this.activateUser(socket, response);
        }
      });

      socket.on('close', () => {
        this.deactivateUser(socket);
      });
    });
  }

  async activateUser(socket: WebSocket, data: AuthenticateAction) {
    try {
      const { userId } = await this.authService.validateToken(
        data.payload.accessToken,
      );
      this.activeUsers.set(userId, socket);
      socket.send(
        JSON.stringify({ status: 'success', message: 'Token validated' }),
      );
    } catch (error) {
      socket.send(
        JSON.stringify({ status: 'error', message: 'Invalid token' }),
      );
    }
  }

  deactivateUser(socket: WebSocket): void {
    for (const [key, value] of this.activeUsers.entries()) {
      if (value === socket) {
        this.activeUsers.delete(key);
      }
    }
  }

  sendDataToClient(userIds: number[], data: any) {
    userIds.forEach((id) => {
      const client = this.activeUsers.get(id);
      if (client) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
