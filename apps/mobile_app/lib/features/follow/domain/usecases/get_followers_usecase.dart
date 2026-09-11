import '../entities/follow_entity.dart';
import '../repositories/follow_repository.dart';

class GetFollowersUseCase {
  final FollowRepository _repository;

  GetFollowersUseCase(this._repository);

  Future<List<FollowEntity>> call(String userId, {int limit = 20, int offset = 0}) {
    return _repository.getFollowers(userId, limit: limit, offset: offset);
  }
}
