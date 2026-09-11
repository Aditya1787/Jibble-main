import '../entities/post_entity.dart';
import '../repositories/post_repository.dart';

class ToggleLikeUseCase {
  final PostRepository _repository;

  ToggleLikeUseCase(this._repository);

  Future<LikeResult> call(String postId) {
    return _repository.toggleLike(postId);
  }
}
