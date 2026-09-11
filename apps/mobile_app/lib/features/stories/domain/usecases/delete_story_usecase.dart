import '../repositories/story_repository.dart';

class DeleteStoryUseCase {
  final StoryRepository _repository;

  DeleteStoryUseCase(this._repository);

  Future<bool> call(String storyId) {
    return _repository.deleteStory(storyId);
  }
}
