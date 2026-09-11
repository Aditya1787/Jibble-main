import '../../../post/data/models/post_model.dart';
import '../repositories/home_repository.dart';

class GetCategoryFeedUseCase {
  final HomeRepository _repository;

  GetCategoryFeedUseCase(this._repository);

  Future<List<PostModel>> call(String category, {int limit = 20, int offset = 0}) {
    return _repository.getCategoryFeed(category, limit: limit, offset: offset);
  }
}
