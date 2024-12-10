export class NotificationResponseFactory {
  static chatCreated(chatId: number) {
    return {
      message: 'CHAT_CREATED',
      payload: { chatId },
    };
  }

  static messageCreated(messageId: number, chatId: number) {
    return {
      message: 'MESSAGE_CREATED',
      payload: {
        messageId,
        chatId,
      },
    };
  }

  static messageUpdated(messageId: number, chatId: number) {
    return {
      message: 'MESSAGE_UPDATED',
      payload: {
        messageId,
        chatId,
      },
    };
  }

  static messageDeleted(messageId: number, chatId: number) {
    return {
      message: 'MESSAGE_DELETED',
      payload: {
        messageId,
        chatId,
      },
    };
  }
}
