import '../entities/chat_entity.dart';
import '../entities/message_entity.dart';

abstract class ChatRepository {
  Future<List<ChatEntity>> getRecentChats();
  Future<List<MessageEntity>> getMessages(String recipientId, {int limit = 50, int offset = 0});
  Future<MessageEntity> sendMessage(String recipientId, {required String content, String? mediaUrl});
  Future<void> markAsRead(String recipientId);
}
