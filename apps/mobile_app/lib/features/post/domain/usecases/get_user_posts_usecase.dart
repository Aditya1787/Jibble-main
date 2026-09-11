import '../../data/models/post_model.dart';
import '../repositories/post_repository.dart';

class GetUserPostsUseCase {
  final PostRepository _repository;

  GetUserPostsUseCase(this._repository);

  Future<List<PostModel>> call(String username, {int limit = 20, int offset = 0}) {
    return _repository.getUserPosts(username, limit: limit, offset: offset);
  }
}
