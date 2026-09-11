/**
 * @file chat.test.ts
 * @description Unit tests for direct messaging chat module.
 */

jest.mock('../modules/chat/chat.repository');

import { chatService } from '../modules/chat/chat.service';
import { chatRepository } from '../modules/chat/chat.repository';
import { AppError } from '../middlewares/error.middleware';

const mockChatRepo = chatRepository as jest.Mocked<typeof chatRepository>;

const MOCK_CONVO_ROW = {
  other_user_id: 'user-2',
  username: 'janedoe',
  display_name: 'Jane Doe',
  avatar_url: 'https://example.com/jane.jpg',
  is_verified: true,
  last_message: 'Hey there!',
  last_message_time: new Date('2024-01-01T12:00:00Z'),
  unread_count: 2,
};

const MOCK_MESSAGE_ROW = {
  id: 'msg-1',
  sender_id: 'user-1',
  recipient_id: 'user-2',
  type: 'text' as const,
  content: 'Hello!',
  media_url: null,
  status: 'sent' as const,
  created_at: new Date('2024-01-01T12:00:00Z'),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('chatService', () => {
  it('getConversations maps rows to ConversationDto array', async () => {
    mockChatRepo.getConversations.mockResolvedValue([MOCK_CONVO_ROW as any]);

    const result = await chatService.getConversations('user-1');

    expect(mockChatRepo.getConversations).toHaveBeenCalledWith('user-1');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      otherUserId: 'user-2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatarUrl: 'https://example.com/jane.jpg',
      isVerified: true,
      lastMessage: 'Hey there!',
      lastMessageTime: new Date('2024-01-01T12:00:00Z').toISOString(),
      unreadCount: 2,
    });
  });

  it('getMessages returns message history with isMine flag', async () => {
    mockChatRepo.getMessages.mockResolvedValue([MOCK_MESSAGE_ROW as any]);
    mockChatRepo.markAsRead.mockResolvedValue(undefined as any);

    const result = await chatService.getMessages('user-1', 'user-2', 50, 0);

    expect(mockChatRepo.getMessages).toHaveBeenCalledWith('user-1', 'user-2', 50, 0);
    expect(result).toHaveLength(1);
    expect(result[0].isMine).toBe(true);
    expect(result[0].content).toBe('Hello!');
  });

  it('sendMessage sends message successfully', async () => {
    mockChatRepo.sendMessage.mockResolvedValue(MOCK_MESSAGE_ROW as any);

    const result = await chatService.sendMessage('user-1', {
      recipientId: 'user-2',
      content: 'Hello!',
      type: 'text',
    });

    expect(mockChatRepo.sendMessage).toHaveBeenCalledWith('user-1', {
      recipientId: 'user-2',
      content: 'Hello!',
      type: 'text',
    });
    expect(result.id).toBe('msg-1');
  });

  it('sendMessage throws BAD_REQUEST when trying to message oneself', async () => {
    await expect(
      chatService.sendMessage('user-1', {
        recipientId: 'user-1',
        content: 'Hello me',
      }),
    ).rejects.toThrow(AppError);
  });

  it('sendMessage throws BAD_REQUEST when content and mediaUrl are missing', async () => {
    await expect(
      chatService.sendMessage('user-1', {
        recipientId: 'user-2',
      }),
    ).rejects.toThrow(AppError);
  });
});
