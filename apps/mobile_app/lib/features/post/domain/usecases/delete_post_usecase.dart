import '../repositories/post_repository.dart';

class DeletePostUseCase {
  final PostRepository _repository;

  DeletePostUseCase(this._repository);

  Future<bool> call(String postId) {
    return _repository.deletePost(postId);
  }
}
