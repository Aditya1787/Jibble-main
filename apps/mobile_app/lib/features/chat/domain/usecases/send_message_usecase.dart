import '../entities/message_entity.dart';
import '../repositories/chat_repository.dart';

class SendMessageUseCase {
  final ChatRepository _repository;

  SendMessageUseCase(this._repository);

  Future<MessageEntity> call(String recipientId, {required String content, String? mediaUrl}) {
    return _repository.sendMessage(recipientId, content: content, mediaUrl: mediaUrl);
  }
}
