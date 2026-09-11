import '../../domain/entities/story_entity.dart';
import '../../domain/repositories/story_repository.dart';
import '../datasources/story_service.dart';

class StoryRepositoryImpl implements StoryRepository {
  final StoryService _service;

  StoryRepositoryImpl({required StoryService service}) : _service = service;

  @override
  Future<List<StoryEntity>> getStories() {
    return _service.getFeedStories();
  }

  @override
  Future<StoryEntity> createStory({required String mediaUrl, String? caption}) {
    return _service.createStory(mediaUrl: mediaUrl, caption: caption);
  }

  @override
  Future<bool> deleteStory(String storyId) {
    return _service.deleteStory(storyId);
  }

  @override
  Future<void> viewStory(String storyId) {
    return _service.viewStory(storyId);
  }
}
