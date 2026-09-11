import '../entities/notification_entity.dart';
import '../repositories/notification_repository.dart';

class GetNotificationsUseCase {
  final NotificationRepository _repository;

  GetNotificationsUseCase(this._repository);

  Future<List<NotificationEntity>> call({int limit = 30, int offset = 0}) {
    return _repository.getNotifications(limit: limit, offset: offset);
  }
}
