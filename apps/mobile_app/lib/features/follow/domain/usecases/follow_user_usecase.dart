import '../repositories/follow_repository.dart';

class FollowUserUseCase {
  final FollowRepository _repository;

  FollowUserUseCase(this._repository);

  Future<bool> call(String userId) {
    return _repository.followUser(userId);
  }
}
