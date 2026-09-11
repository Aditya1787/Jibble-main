import '../entities/story_entity.dart';
import '../repositories/story_repository.dart';

class GetStoriesUseCase {
  final StoryRepository _repository;

  GetStoriesUseCase(this._repository);

  Future<List<StoryEntity>> call() {
    return _repository.getStories();
  }
}
