
import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get(':room')
    async getMessages(@Param('room') room: string) {
        return this.messagesService.getMessages(room);
    }
}
