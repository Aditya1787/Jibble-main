import '../repositories/post_repository.dart';

class ReportPostUseCase {
  final PostRepository _repository;

  ReportPostUseCase(this._repository);

  Future<bool> call(String postId, String reason) {
    return _repository.reportPost(postId, reason);
  }
}
