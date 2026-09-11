import '../repositories/notification_repository.dart';

class MarkNotificationReadUseCase {
  final NotificationRepository _repository;

  MarkNotificationReadUseCase(this._repository);

  Future<bool> call(String id) {
    return _repository.markNotificationRead(id);
  }
}
