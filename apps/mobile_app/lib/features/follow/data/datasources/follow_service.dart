import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../../domain/entities/follow_entity.dart';

class FollowService {
  final ApiClient _client;

  FollowService({required ApiClient client}) : _client = client;

  Future<bool> followUser(String userId) async {
    final response = await _client.dio.post(Endpoints.follow(userId));
    return response.data['success'] as bool? ?? true;
  }

  Future<bool> unfollowUser(String userId) async {
    final response = await _client.dio.delete(Endpoints.unfollow(userId));
    return response.data['success'] as bool? ?? true;
  }

  Future<bool> isFollowing(String userId) async {
    final response = await _client.dio.get(Endpoints.isFollowing(userId));
    return response.data['data']['isFollowing'] as bool? ?? false;
  }

  Future<List<FollowEntity>> getFollowers(String userId, {int limit = 20, int offset = 0}) async {
    final response = await _client.dio.get(
      Endpoints.followers(userId),
      queryParameters: {'limit': limit, 'offset': offset},
    );
    final list = response.data['data'] as List<dynamic>? ?? [];
    return list.map((json) => FollowEntity.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<List<FollowEntity>> getFollowing(String userId, {int limit = 20, int offset = 0}) async {
    final response = await _client.dio.get(
      Endpoints.following(userId),
      queryParameters: {'limit': limit, 'offset': offset},
    );
    final list = response.data['data'] as List<dynamic>? ?? [];
    return list.map((json) => FollowEntity.fromJson(json as Map<String, dynamic>)).toList();
  }
}
