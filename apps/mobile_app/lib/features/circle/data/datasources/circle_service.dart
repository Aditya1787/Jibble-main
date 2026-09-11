import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/event_model.dart';
import '../models/anonymous_post_model.dart';
import '../models/group_model.dart';

class CircleService {
  final ApiClient _client;

  CircleService({required ApiClient client}) : _client = client;

  /// Aggregated Circle Home dashboard endpoint
  Future<Map<String, dynamic>> getCircleHome(String circleId) async {
    final response = await _client.dio.get(Endpoints.circleHome(circleId));
    return response.data['data'] as Map<String, dynamic>;
  }

  /// Create a new circle (Creators only)
  Future<Map<String, dynamic>> createCircle({
    required String name,
    required String description,
    String? avatarUrl,
    String? bannerUrl,
    String type = 'public',
  }) async {
    final response = await _client.dio.post(
      Endpoints.circles,
      data: {
        'name': name,
        'description': description,
        'avatarUrl': avatarUrl,
        'bannerUrl': bannerUrl,
        'type': type,
      },
    );
    return response.data['data'] as Map<String, dynamic>;
  }

  /// Create an event with redirect join link
  Future<EventModel> createEvent(
    String circleId, {
    required String title,
    String? description,
    String? locationName,
    String? joinLink,
    required DateTime startsAt,
    required DateTime endsAt,
  }) async {
    final response = await _client.dio.post(
      Endpoints.circleEvents(circleId),
      data: {
        'title': title,
        'description': description,
        'locationName': locationName,
        'joinLink': joinLink,
        'startsAt': startsAt.toIso8601String(),
        'endsAt': endsAt.toIso8601String(),
      },
    );
    return EventModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  /// Create an anonymous post
  Future<AnonymousPostModel> createAnonymousPost(
    String circleId, {
    required String content,
    List<String>? mediaUrls,
  }) async {
    final response = await _client.dio.post(
      Endpoints.circleAnonymousPosts(circleId),
      data: {
        'content': content,
        'mediaUrls': mediaUrls,
      },
    );
    return AnonymousPostModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  /// Create a sub-group
  Future<GroupModel> createGroup(
    String circleId, {
    required String name,
    String? description,
    String? iconName,
    bool isPrivate = false,
  }) async {
    final response = await _client.dio.post(
      Endpoints.circleGroups(circleId),
      data: {
        'name': name,
        'description': description,
        'iconName': iconName,
        'isPrivate': isPrivate,
      },
    );
    return GroupModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }
}
