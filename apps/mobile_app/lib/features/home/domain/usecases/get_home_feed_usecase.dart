import '../../../post/data/models/post_model.dart';
import '../repositories/home_repository.dart';

class GetHomeFeedUseCase {
  final HomeRepository _repository;

  GetHomeFeedUseCase(this._repository);

  Future<List<PostModel>> call({int limit = 20, int offset = 0}) {
    return _repository.getHomeFeed(limit: limit, offset: offset);
  }
}
