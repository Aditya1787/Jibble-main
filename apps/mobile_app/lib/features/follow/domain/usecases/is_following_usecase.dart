import '../repositories/follow_repository.dart';

class IsFollowingUseCase {
  final FollowRepository _repository;

  IsFollowingUseCase(this._repository);

  Future<bool> call(String userId) {
    return _repository.isFollowing(userId);
  }
}
