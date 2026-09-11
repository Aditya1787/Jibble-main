/**
 * @file chat.service.ts
 * @description Direct messaging business logic.
 */

import { AppError } from '../../middlewares/error.middleware';
import { chatRepository } from './chat.repository';
import { SendMessageDto, ConversationDto, MessageDto } from './chat.types';

export const chatService = {
  async getConversations(userId: string): Promise<ConversationDto[]> {
    const rows = await chatRepository.getConversations(userId);
    return rows.map((r) => ({
      otherUserId: r.other_user_id,
      username: r.username,
      displayName: r.display_name,
      avatarUrl: r.avatar_url ?? null,
      isVerified: Boolean(r.is_verified),
      lastMessage: r.last_message,
      lastMessageTime: r.last_message_time ? new Date(r.last_message_time).toISOString() : null,
      unreadCount: Number(r.unread_count ?? 0),
    }));
  },

  async getMessages(userId: string, otherUserId: string, limit = 50, offset = 0): Promise<MessageDto[]> {
    const rows = await chatRepository.getMessages(userId, otherUserId, limit, offset);
    // Mark messages as read asynchronously
    chatRepository.markAsRead(userId, otherUserId).catch(() => {});

    return rows.map((m) => ({
      id: m.id,
      senderId: m.sender_id,
      recipientId: m.recipient_id,
      type: m.type,
      content: m.content,
      mediaUrl: m.media_url,
      status: m.status,
      createdAt: new Date(m.created_at).toISOString(),
      isMine: m.sender_id === userId,
    }));
  },

  async sendMessage(senderId: string, dto: SendMessageDto): Promise<MessageDto> {
    if (senderId === dto.recipientId) {
      throw AppError.badRequest('You cannot send a message to yourself');
    }
    if (!dto.content && !dto.mediaUrl) {
      throw AppError.badRequest('Message cannot be empty');
    }

    const row = await chatRepository.sendMessage(senderId, dto);
    return {
      id: row.id,
      senderId: row.sender_id,
      recipientId: row.recipient_id,
      type: row.type,
      content: row.content,
      mediaUrl: row.media_url,
      status: row.status,
      createdAt: new Date(row.created_at).toISOString(),
      isMine: true,
    };
  },
};
