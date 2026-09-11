import '../entities/chat_entity.dart';
import '../repositories/chat_repository.dart';

class GetRecentChatsUseCase {
  final ChatRepository _repository;

  GetRecentChatsUseCase(this._repository);

  Future<List<ChatEntity>> call() {
    return _repository.getRecentChats();
  }
}
