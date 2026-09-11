/**
 * @file chat.repository.ts
 * @description Direct messages and conversation queries.
 */

import { query } from '../../db/index';
import { MessageRow, SendMessageDto } from './chat.types';

export const chatRepository = {
  async getConversations(userId: string) {
    const text = `
      WITH RankedMessages AS (
        SELECT 
          m.*,
          CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END AS other_user_id,
          ROW_NUMBER() OVER (
            PARTITION BY CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END
            ORDER BY m.created_at DESC
          ) as rn
        FROM messages m
        WHERE (m.sender_id = $1 AND m.is_deleted_by_sender = FALSE)
           OR (m.recipient_id = $1 AND m.is_deleted_by_recipient = FALSE)
      )
      SELECT 
        rm.other_user_id,
        rm.content AS last_message,
        rm.created_at AS last_message_time,
        p.username,
        p.display_name,
        p.avatar_url,
        p.is_verified,
        (
          SELECT COUNT(*)::int 
          FROM messages unread 
          WHERE unread.recipient_id = $1 
            AND unread.sender_id = rm.other_user_id 
            AND unread.status != 'read'
        ) AS unread_count
      FROM RankedMessages rm
      JOIN profiles p ON p.user_id = rm.other_user_id
      WHERE rm.rn = 1
      ORDER BY rm.created_at DESC
      LIMIT 50
    `;

    const res = await query(text, [userId]);
    return res.rows;
  },

  async getMessages(userId: string, otherUserId: string, limit = 50, offset = 0): Promise<MessageRow[]> {
    const text = `
      SELECT m.*
      FROM messages m
      WHERE ((m.sender_id = $1 AND m.recipient_id = $2 AND m.is_deleted_by_sender = FALSE)
         OR (m.sender_id = $2 AND m.recipient_id = $1 AND m.is_deleted_by_recipient = FALSE))
      ORDER BY m.created_at ASC
      LIMIT $3 OFFSET $4
    `;

    const res = await query(text, [userId, otherUserId, limit, offset]);
    return res.rows as MessageRow[];
  },

  async sendMessage(senderId: string, dto: SendMessageDto): Promise<MessageRow> {
    const text = `
      INSERT INTO messages (sender_id, recipient_id, type, content, media_url, status)
      VALUES ($1, $2, $3, $4, $5, 'sent')
      RETURNING *
    `;

    const res = await query(text, [
      senderId,
      dto.recipientId,
      dto.type || 'text',
      dto.content || null,
      dto.mediaUrl || null,
    ]);

    return res.rows[0] as MessageRow;
  },

  async markAsRead(userId: string, senderId: string): Promise<number> {
    const text = `
      UPDATE messages
      SET status = 'read', read_at = NOW()
      WHERE recipient_id = $1 AND sender_id = $2 AND status != 'read'
    `;

    const res = await query(text, [userId, senderId]);
    return res.rowCount ?? 0;
  },
};
