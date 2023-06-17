import { MessagesModel } from '../daos/models/messages.model.js';
import { MessagesException } from '../exceptions/messages.exceptions.js';

export class MessageService {
  validatePostMsg(email, msg) {
    if (!email || !msg) {
      throw new MessagesException("Please, complete email and message", 400);
    }
  }

  async getAllMessages() {
    const messages = await MessagesModel.find({}).sort({date: 1}).lean();
    if (!!messages) return messages;
    else throw new MessagesException("No messages found", 404);
  }

  async addMessage(message) {
    const email = message.user;
    const msg = message.message;
    this.validatePostMsg(email, msg);
    const msgCreated = await MessagesModel.create(message);
    return msgCreated;
  }
}
