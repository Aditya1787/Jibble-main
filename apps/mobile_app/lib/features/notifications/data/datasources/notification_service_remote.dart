import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/notification_model.dart';

class NotificationServiceRemote {
  final ApiClient _client;

  NotificationServiceRemote({required ApiClient client}) : _client = client;

  Future<List<NotificationModel>> getNotifications({int limit = 30, int offset = 0}) async {
    final response = await _client.dio.get(
      Endpoints.notifications,
      queryParameters: {'limit': limit, 'offset': offset},
    );

    final list = response.data['data'] as List<dynamic>? ?? [];
    return list.map((json) => NotificationModel.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<bool> markAsRead(String id) async {
    final response = await _client.dio.patch(Endpoints.notificationMarkRead(id));
    return response.data['success'] as bool? ?? true;
  }

  Future<bool> markAllAsRead() async {
    final response = await _client.dio.patch(Endpoints.notificationsMarkAll);
    return response.data['success'] as bool? ?? true;
  }

  Future<int> getUnreadCount() async {
    final response = await _client.dio.get(Endpoints.notificationsUnread);
    return response.data['data']['unreadCount'] as int? ?? 0;
  }
}
