// src/messages/messages.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>
    ) { }

    async saveMessage(data: {
        room: string;
        sender: string;
        message: string;
    }): Promise<Message> {
        const created = new this.messageModel(data);
        return created.save();
    }

    async getMessages(room: string): Promise<Message[]> {
        return this.messageModel.find({ room }).sort({ createdAt: 1 }).exec();
    }

    async deleteAll(): Promise<void> {
        await this.messageModel.deleteMany({});
    }
}
