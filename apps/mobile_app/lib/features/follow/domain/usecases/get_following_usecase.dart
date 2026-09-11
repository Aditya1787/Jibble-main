import '../entities/follow_entity.dart';
import '../repositories/follow_repository.dart';

class GetFollowingUseCase {
  final FollowRepository _repository;

  GetFollowingUseCase(this._repository);

  Future<List<FollowEntity>> call(String userId, {int limit = 20, int offset = 0}) {
    return _repository.getFollowing(userId, limit: limit, offset: offset);
  }
}
