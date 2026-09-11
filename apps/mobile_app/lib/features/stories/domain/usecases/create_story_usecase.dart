import '../entities/story_entity.dart';
import '../repositories/story_repository.dart';

class CreateStoryUseCase {
  final StoryRepository _repository;

  CreateStoryUseCase(this._repository);

  Future<StoryEntity> call({required String mediaUrl, String? caption}) {
    return _repository.createStory(mediaUrl: mediaUrl, caption: caption);
  }
}
