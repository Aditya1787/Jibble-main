import '../../domain/entities/follow_entity.dart';
import '../../domain/repositories/follow_repository.dart';
import '../datasources/follow_service.dart';

class FollowRepositoryImpl implements FollowRepository {
  final FollowService _service;

  FollowRepositoryImpl({required FollowService service}) : _service = service;

  @override
  Future<bool> followUser(String userId) {
    return _service.followUser(userId);
  }

  @override
  Future<bool> unfollowUser(String userId) {
    return _service.unfollowUser(userId);
  }

  @override
  Future<bool> isFollowing(String userId) {
    return _service.isFollowing(userId);
  }

  @override
  Future<List<FollowEntity>> getFollowers(String userId, {int limit = 20, int offset = 0}) {
    return _service.getFollowers(userId, limit: limit, offset: offset);
  }

  @override
  Future<List<FollowEntity>> getFollowing(String userId, {int limit = 20, int offset = 0}) {
    return _service.getFollowing(userId, limit: limit, offset: offset);
  }
}
