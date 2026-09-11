import '../../domain/entities/anonymous_post_entity.dart';
import '../../domain/entities/event_entity.dart';
import '../../domain/entities/group_entity.dart';
import '../../domain/repositories/circle_repository.dart';
import '../datasources/circle_service.dart';

class CircleRepositoryImpl implements CircleRepository {
  final CircleService _service;

  CircleRepositoryImpl({required CircleService service}) : _service = service;

  @override
  Future<Map<String, dynamic>> getCircleHome(String circleId) {
    return _service.getCircleHome(circleId);
  }

  @override
  Future<EventEntity> createEvent(
    String circleId, {
    required String title,
    String? description,
    String? locationName,
    String? joinLink,
    required DateTime startsAt,
    required DateTime endsAt,
  }) {
    return _service.createEvent(
      circleId,
      title: title,
      description: description,
      locationName: locationName,
      joinLink: joinLink,
      startsAt: startsAt,
      endsAt: endsAt,
    );
  }

  @override
  Future<AnonymousPostEntity> createAnonymousPost(
    String circleId, {
    required String content,
    List<String>? mediaUrls,
  }) {
    return _service.createAnonymousPost(circleId, content: content, mediaUrls: mediaUrls);
  }

  @override
  Future<GroupEntity> createGroup(
    String circleId, {
    required String name,
    String? description,
    String? iconName,
    bool isPrivate = false,
  }) {
    return _service.createGroup(circleId, name: name, description: description, iconName: iconName, isPrivate: isPrivate);
  }
}
