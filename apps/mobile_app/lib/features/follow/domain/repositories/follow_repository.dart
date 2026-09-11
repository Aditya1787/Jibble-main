import '../entities/follow_entity.dart';

abstract class FollowRepository {
  Future<bool> followUser(String userId);
  Future<bool> unfollowUser(String userId);
  Future<bool> isFollowing(String userId);
  Future<List<FollowEntity>> getFollowers(String userId, {int limit = 20, int offset = 0});
  Future<List<FollowEntity>> getFollowing(String userId, {int limit = 20, int offset = 0});
}
