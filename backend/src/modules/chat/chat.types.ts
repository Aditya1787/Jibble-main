/**
 * @file chat.types.ts
 * @description Types for Direct Messaging (Chat).
 */

export interface MessageRow {
  id: string;
  sender_id: string;
  recipient_id: string;
  type: string;
  content: string | null;
  media_url: string | null;
  status: string;
  created_at: Date;
  sender_username?: string;
  sender_avatar?: string | null;
}

export interface MessageDto {
  id: string;
  senderId: string;
  recipientId: string;
  type: string;
  content: string | null;
  mediaUrl: string | null;
  status: string;
  createdAt: string;
  isMine: boolean;
}

export interface ConversationDto {
  otherUserId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

export interface SendMessageDto {
  recipientId: string;
  type?: string;
  content?: string;
  mediaUrl?: string;
}
