import '../entities/message_entity.dart';
import '../repositories/chat_repository.dart';

class GetMessagesUseCase {
  final ChatRepository _repository;

  GetMessagesUseCase(this._repository);

  Future<List<MessageEntity>> call(String recipientId, {int limit = 50, int offset = 0}) {
    return _repository.getMessages(recipientId, limit: limit, offset: offset);
  }
}
