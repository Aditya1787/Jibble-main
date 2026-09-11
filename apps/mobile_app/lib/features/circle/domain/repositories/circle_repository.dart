import '../entities/event_entity.dart';
import '../entities/anonymous_post_entity.dart';
import '../entities/group_entity.dart';

abstract class CircleRepository {
  Future<Map<String, dynamic>> getCircleHome(String circleId);
  Future<EventEntity> createEvent(
    String circleId, {
    required String title,
    String? description,
    String? locationName,
    String? joinLink,
    required DateTime startsAt,
    required DateTime endsAt,
  });
  Future<AnonymousPostEntity> createAnonymousPost(
    String circleId, {
    required String content,
    List<String>? mediaUrls,
  });
  Future<GroupEntity> createGroup(
    String circleId, {
    required String name,
    String? description,
    String? iconName,
    bool isPrivate = false,
  });
}
