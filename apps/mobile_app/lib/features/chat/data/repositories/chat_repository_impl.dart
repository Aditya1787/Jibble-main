import '../../domain/entities/chat_entity.dart';
import '../../domain/entities/message_entity.dart';
import '../../domain/repositories/chat_repository.dart';
import '../datasources/chat_service.dart';

class ChatRepositoryImpl implements ChatRepository {
  final ChatService _service;

  ChatRepositoryImpl({required ChatService service}) : _service = service;

  @override
  Future<List<ChatEntity>> getRecentChats() {
    return _service.getConversations();
  }

  @override
  Future<List<MessageEntity>> getMessages(String recipientId, {int limit = 50, int offset = 0}) {
    return _service.getMessages(recipientId, limit: limit, offset: offset);
  }

  @override
  Future<MessageEntity> sendMessage(String recipientId, {required String content, String? mediaUrl}) {
    return _service.sendMessage(recipientId, content: content, mediaUrl: mediaUrl);
  }

  @override
  Future<void> markAsRead(String recipientId) async {
    // Handled automatically on fetch or via status endpoint
  }
}
