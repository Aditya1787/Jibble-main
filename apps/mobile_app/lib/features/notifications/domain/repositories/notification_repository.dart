import '../entities/notification_entity.dart';

abstract class NotificationRepository {
  Future<List<NotificationEntity>> getNotifications({int limit = 30, int offset = 0});
  Future<bool> markNotificationRead(String id);
  Future<bool> markAllNotificationsRead();
  Future<int> getUnreadCount();
}
