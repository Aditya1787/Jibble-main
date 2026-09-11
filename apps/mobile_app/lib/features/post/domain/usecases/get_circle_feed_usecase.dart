import '../../data/models/post_model.dart';
import '../repositories/post_repository.dart';

class GetCircleFeedUseCase {
  final PostRepository _repository;

  GetCircleFeedUseCase(this._repository);

  Future<List<PostModel>> call(String circleId, {int limit = 20, int offset = 0}) {
    // Falls back to home feed or circle-specific queries
    return _repository.getHomeFeed(limit: limit, offset: offset);
  }
}
