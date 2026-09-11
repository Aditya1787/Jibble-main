import '../../domain/entities/notification_entity.dart';
import '../../domain/repositories/notification_repository.dart';
import '../datasources/notification_service_remote.dart';

class NotificationRepositoryImpl implements NotificationRepository {
  final NotificationServiceRemote _service;

  NotificationRepositoryImpl({required NotificationServiceRemote service}) : _service = service;

  @override
  Future<List<NotificationEntity>> getNotifications({int limit = 30, int offset = 0}) {
    return _service.getNotifications(limit: limit, offset: offset);
  }

  @override
  Future<bool> markNotificationRead(String id) {
    return _service.markAsRead(id);
  }

  @override
  Future<bool> markAllNotificationsRead() {
    return _service.markAllAsRead();
  }

  @override
  Future<int> getUnreadCount() {
    return _service.getUnreadCount();
  }
}
