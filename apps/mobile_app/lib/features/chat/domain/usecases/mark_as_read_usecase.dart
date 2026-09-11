import '../repositories/chat_repository.dart';

class MarkAsReadUseCase {
  final ChatRepository _repository;

  MarkAsReadUseCase(this._repository);

  Future<void> call(String recipientId) {
    return _repository.markAsRead(recipientId);
  }
}
