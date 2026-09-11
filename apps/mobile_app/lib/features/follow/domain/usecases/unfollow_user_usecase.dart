import '../repositories/follow_repository.dart';

class UnfollowUserUseCase {
  final FollowRepository _repository;

  UnfollowUserUseCase(this._repository);

  Future<bool> call(String userId) {
    return _repository.unfollowUser(userId);
  }
}
