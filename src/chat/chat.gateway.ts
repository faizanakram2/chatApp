import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messagesService: MessagesService) { }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { room: string; message: string; sender: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, message, sender } = data;
    await this.messagesService.saveMessage({ room, message, sender });
    this.server.to(room).emit('receiveMessage', { room, message, sender });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    const history = await this.messagesService.getMessages(room);
    client.emit('chatHistory', history);
    client.to(room).emit('notification', `A user joined room: ${room}`);
  }
  handleConnection(client: Socket) {
    console.log(`User is connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`User is disconnected: ${client.id}`);
  }

  // @SubscribeMessage('joinRoom')
  // handleJoinRoom(client: Socket, room: string) {
  //   client.join(room);
  //   this.server.to(room).emit('notification', `User ${client.id} joined the room`);
  // }

  // @SubscribeMessage('joinRoom')
  // async handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
  //   client.join(room);
  //   client.to(room).emit('notification', `A new user joined ${room}`);

  //   const messages = await this.messagesService.getMessages(room);
  //   client.emit('chatHistory', messages); // Send previous messages
  // }


  // @SubscribeMessage('sendMessage')
  // handleMessage(
  //   @MessageBody() data: { room: string; message: string; sender: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const { room, message, sender } = data;
  //   this.server.to(room).emit('receiveMessage', { message, sender });
  // }




}
